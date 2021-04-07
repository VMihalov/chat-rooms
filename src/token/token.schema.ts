import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop()
  access_token: string;

  @Prop()
  refresh_token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
