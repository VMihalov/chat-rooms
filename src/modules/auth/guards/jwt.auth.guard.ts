import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/modules/token/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const token = req.cookies.jwt;

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

        const access_token = await this.tokenService.createAccessToken(payload);

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
