import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../rooms.service';
import { WsJwtAuthGuard } from 'src/auth/guards/ws.jwt.auth.guard';
import { RoomsFilter } from '../filters/rooms.filter';
import { AddRoomPipe } from '../pipes/add-room.pipe';

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
  async getAll(@ConnectedSocket() socket: Socket) {
    const rooms = await this.roomsService.findAll();
    socket.emit('getRooms', rooms);
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody(AddRoomPipe) title) {
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
