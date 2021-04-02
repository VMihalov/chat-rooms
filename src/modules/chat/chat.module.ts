import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateways } from './chat.gateways';
import { ChatService } from './chat.service';
import { ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }])],
  providers: [ChatGateways, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
