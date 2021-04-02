import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/modules/chat/chat.service';
import { RoomsService } from '../rooms.service';

@WebSocketGateway(3001, { namespace: '/rooms' })
export class RoomsGateway implements OnGatewayInit {
  constructor(
    private roomsService: RoomsService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer() server: Server;

  private logger = new Logger();

  afterInit() {
    this.logger.log('Initialized RoomsGateway');
  }

  @SubscribeMessage('joinToRoom')
  joinToRoom(@MessageBody() roomId, @ConnectedSocket() socket: Socket) {
    socket.join(roomId);
    const numberOfUsers = this.server.in(roomId).adapter.rooms[roomId].length;

    this.server.in(roomId).emit('userJoined', numberOfUsers);

    socket.on('disconnect', () => {
      const getRoom = this.server.in(roomId).adapter.rooms[roomId];

      if (getRoom)
        return this.server.in(roomId).emit('userJoined', getRoom.length);

      return this.server.in(roomId).emit('userJoined', 0);
    });
  }

  @SubscribeMessage('getAllMessages')
  getAllMessages(@MessageBody() roomId, @ConnectedSocket() socket: Socket) {
    this.chatService.getAll(roomId).then((messages) => {
      socket.emit('insertAll', messages);
    });
  }

  @SubscribeMessage('addMessage')
  addMessage(@MessageBody() body, @ConnectedSocket() socket: Socket) {
    this.chatService.addMessage(body.roomId, body.text).then((value) => {
      this.server.in(body.roomId).emit('insertMessage', value.text);
    });
  }
}
