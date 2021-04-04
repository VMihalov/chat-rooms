import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtAuthGuard } from 'src/modules/auth/guards/ws.jwt.auth.guard';
import { ChatService } from 'src/modules/chat/chat.service';
import { AddMessageDto } from '../dto/add-message.dto';

@UseGuards(WsJwtAuthGuard)
@WebSocketGateway(3001, {
  namespace: '/rooms',

  handlePreflightRequest: (req, res) => {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': false,
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization',
    });
    res.end();
  },
})
export class RoomsGateway implements OnGatewayInit {
  constructor(private chatService: ChatService) {}

  @WebSocketServer() server: Server;

  private logger = new Logger();

  afterInit() {
    this.logger.log('Initialized RoomsGateway');
  }

  @SubscribeMessage('joinToRoom')
  joinToRoom(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
    socket.join(roomId);
    const numberOfUsers: number = this.server.in(roomId).adapter.rooms[roomId]
      .length;

    this.server.in(roomId).emit('userJoined', numberOfUsers);

    socket.on('disconnect', () => {
      const getRoom: SocketIO.Room = this.server.in(roomId).adapter.rooms[
        roomId
      ];

      if (getRoom)
        return this.server.in(roomId).emit('userJoined', getRoom.length);

      return this.server.in(roomId).emit('userJoined', 0);
    });
  }

  @SubscribeMessage('getAllMessages')
  getAllMessages(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.chatService.getAll(roomId).then((messages) => {
      socket.emit('insertAll', messages);
    });
  }

  @SubscribeMessage('addMessage')
  addMessage(@MessageBody() addMessageDto: AddMessageDto) {
    this.chatService
      .addMessage(addMessageDto.roomId, addMessageDto.text)
      .then((value) => {
        this.server.in(addMessageDto.roomId).emit('insertMessage', value.text);
      });
  }
}
