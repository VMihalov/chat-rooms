import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPayload } from './interfaces/payload.interface';
import { TokenDocument, Token } from './token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
  ) {}

  createAccessToken(payload: IPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  }

  createRefreshToken(payload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  createTokenProfile(access_token: string): Promise<TokenDocument> {
    const refresh_token = this.createRefreshToken({});

    return this.tokenModel.create({ access_token, refresh_token });
  }

  deleteTokenProfile(id: string): any {
    return this.tokenModel.findByIdAndDelete(id);
  }

  async getTokenProfile(access_token: string): Promise<TokenDocument> {
    return await this.tokenModel.findOne({ access_token });
  }

  verify(token: string): TokenDocument {
    return this.jwtService.verify(token);
  }

  verifyAsync(token: string): Promise<TokenDocument> {
    return this.jwtService.verifyAsync(token);
  }

  decode(token: string): string | { [key: string]: number } {
    return this.jwtService.decode(token);
  }
}
