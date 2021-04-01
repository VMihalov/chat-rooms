import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, { transports: ['websocket', 'polling'] })
export class ChatGateways
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Initialized');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Connected ', client.id);
  }

  handleDisconnect() {
    console.log('Disconnected');
  }

}
