import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class UpdateUserCredential {

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}