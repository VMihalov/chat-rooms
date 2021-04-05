import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  canActivate(context: ExecutionContext) {
    try {
      const token: string = context
        .switchToHttp()
        .getRequest()
        .handshake.headers.authorization.substr(7);

      const verify = this.jwtService.verify(token);

      if (!verify) throw new WsException('Invalid token');

      const decode = this.jwtService.decode(token);

      this.userService.findOneByEmail(decode['email']).then((profile) => {
        if (!profile) throw new WsException('Invalid token');
      });

      return true;
    } catch (error) {
      throw new WsException(error);
    }
  }
}
