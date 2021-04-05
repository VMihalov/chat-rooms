import {
  Controller,
  Get,
  Post,
  Render,
  Body,
  Redirect,
  Res,
  BadRequestException,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/modules/mail/mail.service';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AllExceptionsFilter } from './all-exceptions.filter';

@UseFilters(AllExceptionsFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Get('login')
  @HttpCode(HttpStatus.OK)
  @Render('auth/login')
  login() {
    return;
  }

  @Get('sign-up')
  @HttpCode(HttpStatus.OK)
  @Render('auth/signup')
  signUp() {
    return;
  }

  @Post('sign-up')
  @Redirect('login')
  async create(@Body() createUserDto: CreateUserDto) {
    const findUser = await this.userService.findAll(createUserDto.email);

    if (findUser.length) throw new BadRequestException('User exists');

    const hash: string = await bcrypt.hash(createUserDto.password, 10);

    createUserDto.password = hash;

    this.userService.creteUser(createUserDto);
  }

  @Post('login')
  async auth(@Body() userDto: UserDto, @Res() res: Response) {
    const findUser = await this.userService.findOne(userDto.email);

    if (!findUser) throw new BadRequestException('User not found');

    const isMatch = await bcrypt.compare(userDto.password, findUser.password);

    if (!isMatch) throw new BadRequestException('Incorrect email or password');

    const token = await this.authService.login(findUser._id, userDto.email);

    res.cookie('jwt', token.access_token, { httpOnly: true });
    res.redirect('../rooms');
  }

  @Get('reset')
  @HttpCode(HttpStatus.OK)
  @Render('auth/password/reset')
  resetPassword() {
    return;
  }

  @Post('reset')
  @Redirect('/auth/login')
  async reset(@Body('email') email: string) {
    const person = await this.userService.findByEmail(email);

    if (!person) throw new BadRequestException('User not found');

    const token = randomBytes(40).toString('hex');

    this.authService.createResetProfile(person._id, token).then((value) => {
      this.mailService.send(email, value.token);
    });
  }

  @Get('reset/:token')
  @HttpCode(HttpStatus.OK)
  @Render('auth/password/update')
  async resetLink(@Param('token') token: string) {
    const profile = await this.authService.findResetProfile(token);

    if (!profile) throw new BadRequestException('Invalid token');

    return { token, valid: profile.valid };
  }

  @Post('reset/:token')
  async updatePassword(
    @Param('token') token: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const hash = await bcrypt.hash(password, 10);
    this.authService.findResetProfile(token).then((profile) => {
      if (!profile) throw new BadRequestException('Invalid token');

      if (!profile.valid) {
        res.redirect('/auth/reset/' + token);
      } else {
        password = hash;
        this.userService
          .findOneByIdAndUpdatePassword(profile.userId, password)
          .then(() => {
            this.authService.changeValid(profile._id);
            res.redirect('/auth/reset/' + token);
            res.end();
          });
      }
    });
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @Redirect('/auth/login')
  logout(@Res() res: Response, @Req() req: Request) {
    this.authService.logout(req.cookies.jwt);
    res.clearCookie('jwt');
    res.clearCookie('io');
  }
}
