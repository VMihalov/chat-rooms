import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const token = req.cookies.jwt;

    if (!token) throw new UnauthorizedException();

    const check = this.jwtService.verify(token);

    if (!check) throw new UnauthorizedException();

    const payload = this.jwtService.decode(token);

    if (!payload) throw new UnauthorizedException();
    else req.user = payload;

    return true;
  }
}
