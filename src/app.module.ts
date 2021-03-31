import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@test.avqvx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    ),
    RoomsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
