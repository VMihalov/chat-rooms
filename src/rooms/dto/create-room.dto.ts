import { IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @Min(1)
  title: string;
}
