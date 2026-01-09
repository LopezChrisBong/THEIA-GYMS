import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class CreateUserAuthDto {


    @ApiProperty()
    @IsNotEmpty()
    fname: string;

    @ApiProperty()
    mname: string;

    @ApiProperty()
    @IsNotEmpty()
    lname: string;

    @ApiProperty()
    suffix: string;

    @ApiProperty()
    @IsNotEmpty()
    address: string;


    @ApiProperty()
    @IsNotEmpty()
    contact_no: string;




}
