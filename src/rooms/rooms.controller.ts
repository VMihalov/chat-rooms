import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Render,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('rooms')
@ApiCookieAuth()
@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get('/')
  @ApiOkResponse({ description: 'The page was successfully opened' })
  @HttpCode(HttpStatus.OK)
  @Render('rooms/rooms')
  async root(@Req() req: Request) {
    const rooms = await this.roomsService.findAll();
    return { user: req.user, token: req.cookies.jwt, rooms };
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The page was successfully opened' })
  @HttpCode(HttpStatus.OK)
  @Render('rooms/singleRoom')
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
