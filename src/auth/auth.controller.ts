import {
  Controller,
  Get,
  Post,
  Render,
  Body,
  Redirect,
  NotAcceptableException,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @Render('login')
  login() {
    return;
  }

  @Get('sign-up')
  @Render('signup')
  signUp() {
    return;
  }

  @Post('sign-up')
  @Redirect('login')
  async create(@Body() userDto: UserDto) {
    const findUser = await this.authService.findAllUsers(userDto.email);

    if (findUser.length) throw new NotAcceptableException('User exists');

    this.authService.creteUser(userDto);
  }

  @Post('login')
  async auth(@Body() userDto: UserDto, @Res() res) {
    const findUser = await this.authService.findUser(userDto);

    if (!findUser) throw new NotAcceptableException('User not found');

    const token = this.authService.login(findUser._id, userDto.email);

    res.cookie('jwt', token.access_token, { httpOnly: true });
    res.redirect('../rooms');
  }

  @Get('logout')
  @Redirect('/auth/login')
  logout(@Res() res) {
    res.clearCookie('jwt');
  }
}
