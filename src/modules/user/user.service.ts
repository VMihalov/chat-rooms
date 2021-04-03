import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  creteUser(user) {
    return this.userModel.create(user);
  }

  findAll(email: string) {
    return this.userModel.find({
      email,
    });
  }

  findOne(user) {
    return this.userModel.findOne({
      email: user.email,
    });
  }

  findById(ids: Array<string>) {
    return this.userModel.find({ _id: { $in: ids } });
  }

  async findOneById(id: string): Promise<any> {
    return await this.userModel.findOne({ _id: id });
  }

  async findOneByEmail(email: string): Promise<any> {
    return await this.userModel.findOne({ email });
  }

  async findOneByIdAndUpdatePassword(id, password: string): Promise<any> {
    await this.userModel.findOneAndUpdate({ _id: id }, { password });
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
