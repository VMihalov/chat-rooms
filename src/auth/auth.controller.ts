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
  Put,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthExceptionsFilter } from './filters/auth.filter';
import { EmailDto } from './dto/email.dto';
import { TokenDto } from './dto/token.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@UseFilters(AuthExceptionsFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Get('login')
  @ApiOkResponse({ description: 'The page was successfully opened' })
  @HttpCode(HttpStatus.OK)
  @Render('auth/login')
  auth() {
    return;
  }

  @Get('sign-up')
  @ApiOkResponse({ description: 'The page was successfully opened' })
  @HttpCode(HttpStatus.OK)
  @Render('auth/signup')
  signUp() {
    return;
  }

  @Post('sign-up')
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @Redirect('login')
  async create(@Body() createUserDto: CreateUserDto) {
    const findUser = await this.userService.findAll(createUserDto.email);

    if (findUser.length) throw new BadRequestException('User exists');

    this.userService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({
    status: 303,
    description: 'Successful login, redirect to the allowed page',
  })
  @ApiBadRequestResponse({ description: 'The resulting user was not found' })
  async login(@Body() userDto: UserDto, @Res() res: Response) {
    const findUser = await this.userService.findOne(userDto.email);

    if (!findUser) throw new BadRequestException('User not found');

    const validPass = await this.authService.validate(
      userDto.password,
      findUser.password,
    );

    if (!validPass)
      throw new BadRequestException('Incorrect email or password');

    const token = await this.authService.login(findUser._id, userDto.email);

    res.cookie('jwt', token.access_token, { httpOnly: true });
    res.redirect('../rooms');
  }

  @Get('reset')
  @ApiOkResponse({ description: 'The page was successfully opened' })
  @HttpCode(HttpStatus.OK)
  @Render('auth/password/reset')
  resetPassword() {
    return;
  }

  @Post('reset')
  @ApiResponse({
    status: 303,
    description: 'The email was successfully sent, redirect to the login page',
  })
  @ApiBadRequestResponse({ description: 'User not found' })
  @Redirect('/auth/login')
  async reset(@Body() body: EmailDto) {
    const person = await this.userService.findByEmail(body.email);

    if (!person) throw new BadRequestException('User not found');

    const token = await this.authService.randomBytes(40);

    this.authService.createResetProfile(person._id, token).then((value) => {
      this.mailService.send(body.email, value.token);
    });
  }

  @Get('reset/:token')
  @ApiOkResponse({
    description:
      'The correct token was received, the page was successfully opened',
  })
  @ApiBadRequestResponse({ description: 'Invalid token' })
  @HttpCode(HttpStatus.OK)
  @Render('auth/password/update')
  async resetLink(@Param() param: TokenDto) {
    const profile = await this.authService.findResetProfile(param.token);

    if (!profile) throw new BadRequestException('Invalid token');

    return { token: param.token, valid: profile.valid };
  }

  @Put('reset/:token')
  @ApiResponse({
    status: 303,
    description: 'Password reset correctly, update page',
  })
  @ApiBadRequestResponse({ description: 'Invalid token' })
  @Redirect('back')
  async updatePassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ) {
    const resetProfile = await this.authService.findResetProfile(token);

    if (!resetProfile) throw new BadRequestException('Invalid token');

    if (resetProfile.valid) {
      const update = await this.userService.findOneByIdAndUpdatePassword(
        resetProfile.userId,
        password,
      );

      if (update) await this.authService.changeValid(resetProfile._id);
      else throw new BadRequestException('Error');
    }
  }

  @Get('logout')
  @ApiResponse({ status: 303, description: 'User successfully logged out' })
  @HttpCode(HttpStatus.OK)
  @Redirect('/auth/login')
  logout(@Res() res: Response, @Req() req: Request) {
    this.authService.logout(req.cookies.jwt);
    res.clearCookie('jwt');
    res.clearCookie('io');
  }
}
