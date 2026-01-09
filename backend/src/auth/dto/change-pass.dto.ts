import { ApiProperty } from "@nestjs/swagger";
import { IsAscii, IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class ChangePasswordDto {

    @ApiProperty()
    old_password: string;

    @ApiProperty()
    new_password: string;

}
