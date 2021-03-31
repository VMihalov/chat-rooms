import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Render,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthService } from '../auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Redirect } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Req } from '@nestjs/common';

@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  @Render('profile')
  root(@Req() req) {
    const rooms = this.roomsService.findAll();
    console.log(rooms);
    return req.user, rooms;
  }

  @UseGuards(AuthGuard)
  @Post('/')
  @Redirect('/rooms')
  create(@Body() room, @Req() req) {
    this.roomsService.create(room.title, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @Render('room')
  async currentRoom(@Param('id') id, @Req() req) {
    const isMember = await this.roomsService.findByIdAndUserId(id, req.user.id);

    if (isMember === null) {
      await this.roomsService.addUserToRoom(id, req.user.id);
    }

    const data = await this.roomsService.findById(id);

    if (!data) {
      throw new BadRequestException('Undefined id');
    }

    const users = await this.authService.findUsersByIds(data.members);

    return { title: data.title, users };
  }
}
