import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { RoomsService } from './rooms.service';
import { RoomsSchema, Rooms } from './schemas/rooms.schema';
import { RoomsController } from './rooms.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RoomsGateway } from './gateways/rooms.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { RoomsMenuGateway } from './gateways/rooms-menu.gateway';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rooms.name, schema: RoomsSchema }]),
    AuthModule,
    ChatModule,
    PassportModule,
    UserModule,
    TokenModule,
  ],
  providers: [RoomsService, RoomsGateway, RoomsMenuGateway],
  exports: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
