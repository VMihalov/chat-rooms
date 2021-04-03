import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../rooms.service';

@WebSocketGateway(3001, { namespace: '/menu' })
export class RoomsMenuGateway {
  constructor(private roomsService: RoomsService) {}
  @WebSocketServer() server: Server;

  private logger = new Logger();

  afterInit() {
    this.logger.log('Initialized RoomsMenuGateway');
  }

  @SubscribeMessage('getAll')
  getAll(@ConnectedSocket() socket: Socket) {
    this.roomsService.findAll().then((rooms) => {
      socket.emit('getRooms', rooms);
    });
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() body) {
    this.roomsService.create(body).then((value) => {
      this.server.local.emit('insertRoom', {
        id: value._id,
        title: value.title,
      });
    });
  }
}
