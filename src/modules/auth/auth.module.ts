import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { MailModule } from 'src/modules/mail/mail.module';
import { UserModule } from 'src/modules/user/user.module';
import { Reset, ResetSchema } from './reset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reset.name, schema: ResetSchema }]),
    JwtModule.register({
      secret: 'process.env.SECRET_KEY',
      signOptions: { expiresIn: '6h' },
    }),
    UserModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard, JwtModule, AuthService],
})
export class AuthModule {}
