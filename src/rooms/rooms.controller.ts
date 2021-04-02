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
import { ChatService } from 'src/chat/chat.service';

@Controller('rooms')
@UseGuards(AuthGuard)
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

  @Get('/')
  @Render('profile')
  async root(@Req() req) {
    const rooms = await this.roomsService.findAll();
    return { user: req.user, rooms };
  }

  @Post('/')
  @Redirect('/rooms')
  create(@Body() room) {
    this.roomsService.create(room.title);
  }

  @Get(':id')
  @Render('room')
  async currentRoom(@Param('id') id, @Req() req) {
    //const isMember = await this.roomsService.findByIdAndUserId(id, req.user.id);

    //if (isMember === null) {
    //  await this.roomsService.addUserToRoom(id, req.user.id);
    //}

    const data = await this.roomsService.findById(id);

    if (!data) {
      throw new BadRequestException('Undefined id');
    }

    //const messages = await this.chatService.getAll(id);

    return { title: data.title, userId: JSON.stringify(req.user.id) };
  }
}
