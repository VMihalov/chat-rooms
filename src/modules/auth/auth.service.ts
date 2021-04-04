import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { Reset, ResetDocument } from './reset.schema';
import { TokenService } from '../token/token.service';
import { TokenDocument } from '../token/token.schema';
import { IPayload } from '../token/interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Reset.name) private readonly resetSchema: Model<ResetDocument>,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async createResetProfile(id: string, token: string): Promise<ResetDocument> {
    return await this.resetSchema.create({ userId: id, token });
  }

  async findResetProfile(token: string): Promise<ResetDocument> {
    return await this.resetSchema.findOne({ token });
  }

  async deleteResetProfile(id: string): Promise<ResetDocument> {
    return await this.resetSchema.findOneAndDelete({ _id: id });
  }

  async changeValid(id: string): Promise<ResetDocument> {
    return await this.resetSchema.findOneAndUpdate(
      { _id: id },
      { valid: false },
    );
  }

  login(id: string, email: string) {
    const payload: IPayload = {
      id,
      email,
    };

    const access_token: string = this.tokenService.createAccessToken(payload);

    this.tokenService.createTokenProfile(access_token);

    return {
      access_token,
    };
  }

  async logout(access_token: string): Promise<TokenDocument> {
    return await this.tokenService
      .getTokenProfile(access_token)
      .then((profile) => {
        return this.tokenService.deleteTokenProfile(profile._id);
      });
  }

  hashPassword(password: string): string {
    return pbkdf2Sync(
      password,
      randomBytes(16).toString('hex'),
      1000,
      32,
      `sha512`,
    ).toString(`hex`);
  }
}
