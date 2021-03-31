import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  creteUser(user: IUser) {
    return this.userModel.create(user);
  }

  findAllUsers(email: string) {
    return this.userModel.find({
      email,
    });
  }

  findUser(user: IUser) {
    return this.userModel.findOne({
      email: user.email,
      password: user.password,
    });
  }

  findUsersByIds(ids: Array<string>) {
    return this.userModel.find({ _id: { $in: ids } });
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
}
