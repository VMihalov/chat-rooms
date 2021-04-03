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
import { Redirect } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { ChatService } from 'src/modules/chat/chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

  @Get('/')
  @Render('roomsMenu')
  async root(@Req() req) {
    const rooms = await this.roomsService.findAll();
    return { user: req.user, token: req.cookies.jwt, rooms };
  }

  @Post('/')
  @Redirect('/rooms')
  create(@Body() room) {
    this.roomsService.create(room.title);
  }

  @Get(':id')
  @Render('room')
  async currentRoom(@Param('id') id, @Req() req) {
    const data = await this.roomsService.findById(id);

    if (!data) {
      throw new BadRequestException('Undefined id');
    }

    return {
      title: data.title,
      userId: JSON.stringify(req.user.id),
      token: req.cookies.jwt,
    };
  }
}
