import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserDetailDto {
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
    statusID: number;

    @ApiProperty()
    @IsNotEmpty()
    usertypeID: number;



    // @ApiProperty()
    // @IsNotEmpty()
    // @IsNumber()
    // statusID: number;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsNumber()
    // user: number;


}
