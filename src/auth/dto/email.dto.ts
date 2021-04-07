import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
