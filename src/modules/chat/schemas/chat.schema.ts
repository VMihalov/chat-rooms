import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop()
  text: string;

  @Prop()
  roomsId: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
