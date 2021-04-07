import { IsNotEmpty, IsString } from 'class-validator';

export class AddMessageDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
