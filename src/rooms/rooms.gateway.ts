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
import { ChatService } from 'src/chat/chat.service';
import { RoomsService } from './rooms.service';

@WebSocketGateway(3001)
export class RoomsGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
  constructor(
    private roomsService: RoomsService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer() server: Server;

  private logger = new Logger();

  afterInit() {
    this.logger.log('Initialized RoomsGateway');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('Connected ' + socket.id);
  }

  handleDisconnect() {
    console.log('Disconnected');
  }

  @SubscribeMessage('addRoom')
  addRoom(@MessageBody() body, @ConnectedSocket() socket: Socket) {
    this.roomsService.create(body).then((value) => {
      this.server.local.emit('insertRoom', {
        id: value._id,
        title: value.title,
      });
    });
  }

  @SubscribeMessage('joinToRoom')
  joinToRoom(@MessageBody() roomId, @ConnectedSocket() socket: Socket) {
    socket.join(roomId);
  }

  @SubscribeMessage('addMessage')
  addMessage(@MessageBody() body, @ConnectedSocket() socket: Socket) {
    this.chatService.addMessage(body.roomId, body.text).then((value) => {
      this.server.in(body.roomId).emit('insertMessage', value.text);
    });
  }

  @SubscribeMessage('addMember')
  addMember(@MessageBody() body) {
    console.log(body);
    this.roomsService.addUserToRoom(body.roomId, body.userId).then((value) => {
      console.log(value);
    });
  }

  @SubscribeMessage('deleteMember')
  deleteMember(@MessageBody() body) {
    this.roomsService.deleteMember(body.roomId, body.userId).then((value) => {
      console.log(value);
    });
  }
}
