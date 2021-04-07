import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  send(to: string, token: string) {
    return this.mailerService.sendMail({
      to,
      from: process.env.MAILER_USER,
      subject: 'Reset password ✔',
      text: 'Reset password',
      html: `To update your password follow the link:<br><a href="http://localhost:3000/auth/reset/${token}">
              http://localhost:3000/auth/reset/${token}
            </a>`,
    });
  }
}
