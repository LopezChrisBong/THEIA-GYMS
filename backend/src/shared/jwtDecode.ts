import { JwtService } from '@nestjs/jwt';

export function currentUser(headers) {
  var arr = headers.split(' ');
  var token_string = arr[1].toString();

  const data = JwtService.prototype.decode(token_string);

  return JSON.parse(JSON.stringify(data));
}
