import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Render,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Redirect } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { RoomsService } from './rooms.service';
import { AuthService } from '../auth/auth.service';
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
  @HttpCode(HttpStatus.OK)
  @Render('roomsMenu')
  async root(@Req() req: Request) {
    const rooms = await this.roomsService.findAll();
    return { user: req.user, token: req.cookies.jwt, rooms };
  }

  @Post('/')
  @Redirect('/rooms')
  create(@Body('title') title: string) {
    this.roomsService.create(title);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Render('room')
  async currentRoom(@Param('id') id: string, @Req() req: Request | any) {
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
