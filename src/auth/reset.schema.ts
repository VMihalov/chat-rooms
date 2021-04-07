import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResetDocument = Reset & Document;

@Schema()
export class Reset {
  @Prop()
  token: string;

  @Prop()
  userId: string;

  @Prop({ default: true })
  valid: boolean;
}

export const ResetSchema = SchemaFactory.createForClass(Reset);
