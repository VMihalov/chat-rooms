import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user) {
    const hash: string = await bcrypt.hash(user.password, 10);

    user.password = hash;

    return this.userModel.create(user);
  }

  findAll(email: string): UserDocument[] | UserDocument | any {
    return this.userModel.find({
      email,
    });
  }

  findOne(email: string): UserDocument | any {
    return this.userModel.findOne({
      email,
    });
  }

  findById(ids: Array<string>): UserDocument[] | UserDocument | any {
    return this.userModel.find({ _id: { $in: ids } });
  }

  async findOneById(id: string): Promise<UserDocument> {
    return await this.userModel.findOne({ _id: id });
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }

  async findOneByIdAndUpdatePassword(id: string, password: string) {
    const hash: string = await bcrypt.hash(password, 10);

    return this.userModel.findByIdAndUpdate(id, { password: hash });
  }

  findByEmail(email: string): UserDocument | any {
    return this.userModel.findOne({ email });
  }
}
