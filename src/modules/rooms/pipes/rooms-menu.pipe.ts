import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class RoomsMenuPipe implements PipeTransform<any> {
  async transform(value: string) {
    if (value.length < 1) throw new WsException('Validation error');
    if (value.length > 40) throw new WsException('Validation error');

    return value;
  }
}
