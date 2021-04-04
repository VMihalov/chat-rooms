import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/modules/token/token.service';
import { Response, Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const token: string = req.cookies.jwt;

    try {
      await this.tokenService.verify(token);

      const user = this.tokenService.decode(token);

      req.user = user;

      return true;
    } catch (err) {
      try {
        const profile = await this.tokenService.getTokenProfile(token);
        await this.tokenService.verify(profile.refresh_token);

        const payload = await this.tokenService.decode(profile.access_token);

        delete payload['iat'];
        delete payload['exp'];

        const access_token: string = await this.tokenService.createAccessToken({
          id: payload['id'],
          email: payload['email'],
        });

        await this.tokenService.createTokenProfile(access_token);
        await this.tokenService.deleteTokenProfile(profile._id);

        res.cookie('jwt', access_token, { httpOnly: true });

        return true;
      } catch (err) {
        throw new UnauthorizedException();
      }
    }
  }
}
