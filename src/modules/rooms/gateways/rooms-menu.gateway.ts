import { Logger, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
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
import { RoomsFilter } from '../filters/rooms.filter';
import { RoomsMenuPipe } from '../pipes/rooms-menu.pipe';

@UseGuards(WsJwtAuthGuard)
@UseFilters(RoomsFilter)
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
  getAll(@ConnectedSocket() socket: Socket) {
    this.roomsService.findAll().then((rooms) => {
      socket.emit('getRooms', rooms);
    });
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody(RoomsMenuPipe) title) {
    this.roomsService.create(title).then((value) => {
      this.server.local.emit('insertRoom', {
        id: value._id,
        title: value.title,
      });
    });
  }

  @SubscribeMessage('searchReq')
  searchReq(@MessageBody() title: string, @ConnectedSocket() socket: Socket) {
    this.roomsService.findRoom(title).then((rooms) => {
      socket.emit('getRooms', rooms);
    });
  }
}
