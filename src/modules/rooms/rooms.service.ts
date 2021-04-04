import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomsDocument } from './schemas/rooms.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel('Rooms') private readonly roomsModel: Model<RoomsDocument>,
  ) {}

  async create(title: string): Promise<RoomsDocument> {
    return await this.roomsModel.create({ title });
  }

  async findAll(): Promise<RoomsDocument[]> {
    return await this.roomsModel.find();
  }

  findById(id: string) {
    return this.roomsModel.findById(id);
  }

  async findRoom(title: string): Promise<RoomsDocument[]> {
    return await this.roomsModel.find({
      title: { $regex: title, $options: 'i' },
    });
  }

  addUserToRoom(roomId: string, userId: string) {
    return this.roomsModel.findByIdAndUpdate(roomId, {
      $addToSet: { members: userId },
    });
  }

  async deleteMember(roomId: string, userId: string): Promise<RoomsDocument> {
    return await this.roomsModel.findByIdAndUpdate(roomId, {
      $pull: { members: userId },
    });
  }
}
