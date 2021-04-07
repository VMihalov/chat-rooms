import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { encode } from 'html-entities';

@Injectable()
export class AddMessagePipe implements PipeTransform<any> {
  async transform(value: any) {
    if (value.text.length < 1) throw new WsException('Validation error');
    if (value.text.length > 600) throw new WsException('Validation error');

    value.text = encode(value.text);

    return value;
  }
}
