import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomsDocument = Rooms & Document;

@Schema()
export class Rooms {
  @Prop()
  title: string;
  @Prop()
  members: Array<string>;
}

export const RoomsSchema = SchemaFactory.createForClass(Rooms);
