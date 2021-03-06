import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from 'src/user/user.module';
import { Reset, ResetSchema } from './reset.schema';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { WsJwtAuthGuard } from './guards/ws.jwt.auth.guard';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reset.name, schema: ResetSchema }]),
    UserModule,
    MailModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, JwtStrategy, WsJwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, WsJwtAuthGuard],
})
export class AuthModule {}
