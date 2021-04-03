import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from 'src/modules/mail/mail.module';
import { UserModule } from 'src/modules/user/user.module';
import { Reset, ResetSchema } from './reset.schema';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { WsJwtAuthGuard } from './guards/ws.jwt.auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reset.name, schema: ResetSchema }]),
    JwtModule.register({
      secret: 'cat',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, JwtStrategy, WsJwtAuthGuard],
  exports: [JwtModule, AuthService, JwtAuthGuard, WsJwtAuthGuard],
})
export class AuthModule {}
