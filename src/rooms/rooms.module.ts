import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsService } from './rooms.service';
import { RoomsSchema, Rooms } from './schemas/rooms.schema';
import { RoomsController } from './rooms.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rooms.name, schema: RoomsSchema }]),
    AuthModule,
  ],
  providers: [RoomsService],
  exports: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
