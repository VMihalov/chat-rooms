import { Logger, UseGuards, Request } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../rooms.service';
import { WsJwtAuthGuard } from 'src/modules/auth/guards/ws.jwt.auth.guard';

@UseGuards(WsJwtAuthGuard)
@WebSocketGateway(3001, {
  namespace: '/menu',
})
export class RoomsMenuGateway {
  constructor(private roomsService: RoomsService) {}
  @WebSocketServer() server: Server;

  private logger = new Logger();

  afterInit() {
    this.logger.log('Initialized RoomsMenuGateway');
  }

  @SubscribeMessage('getAll')
  getAll(@ConnectedSocket() socket: Socket, @Request() req) {
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
