import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenDocument, Token } from './token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
  ) {}

  createAccessToken(payload) {
    return this.jwtService.sign(payload, {
      expiresIn: '30m',
    });
  }

  createRefreshToken(payload) {
    return this.jwtService.sign(payload, {
      expiresIn: '1d',
    });
  }

  createTokenProfile(access_token) {
    const refresh_token = this.createRefreshToken({});

    return this.tokenModel.create({ access_token, refresh_token });
  }

  deleteTokenProfile(id) {
    return this.tokenModel.findByIdAndDelete(id);
  }

  async getTokenProfile(access_token): Promise<any> {
    return await this.tokenModel.findOne({ access_token });
  }

  verify(token: string) {
    return this.jwtService.verify(token);
  }

  verifyAsync(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }

  decode(token: string) {
    return this.jwtService.decode(token);
  }
}
