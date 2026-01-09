import { ApiProperty } from '@nestjs/swagger';
import { IsAscii, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;
}
