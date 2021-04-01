import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<ChatDocument>,
  ) {}

  getAll(roomsId: string) {
    return this.chatModel.find({ roomsId });
  }

  addMessage(roomsId: string, text: string) {
    return this.chatModel.create({ text, roomsId });
  }
}
