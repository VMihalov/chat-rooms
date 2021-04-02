import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { Reset, ResetDocument } from './reset.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Reset.name) private readonly resetSchema: Model<ResetDocument>,
    private jwtService: JwtService,
  ) {}

  async createResetProfile(id: string, token: string): Promise<any> {
    return await this.resetSchema.create({ userId: id, token });
  }

  async findResetProfile(token: string): Promise<any> {
    return await this.resetSchema.findOne({ token });
  }

  async deleteResetProfile(id): Promise<any> {
    return await this.resetSchema.findOneAndDelete({ _id: id });
  }

  async changeValid(id): Promise<any> {
    return await this.resetSchema.findOneAndUpdate(
      { _id: id },
      { valid: false },
    );
  }

  login(id, email) {
    const payload = {
      id,
      email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
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
