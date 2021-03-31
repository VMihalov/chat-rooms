import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomsDocument } from './schemas/rooms.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel('Rooms') private readonly roomsModel: Model<RoomsDocument>,
  ) {}

  async create(title: string, creatorId: string): Promise<any> {
    return await this.roomsModel.create({ title, members: [creatorId] });
  }

  async findAll(): Promise<any> {
    return await this.roomsModel.find();
  }

  findById(id: string) {
    return this.roomsModel.findById(id);
  }

  findByIdAndUserId(roomId: string, userId: string) {
    return this.roomsModel.findOne({ _id: roomId, members: { $in: [userId] } });
  }

  addUserToRoom(roomId: string, userId: string) {
    return this.roomsModel.findByIdAndUpdate(roomId, {
      $addToSet: { members: userId },
    });
  }
}
