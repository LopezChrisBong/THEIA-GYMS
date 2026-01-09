
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class UpdateEmployeeDto {
    @ApiProperty()
    @IsNotEmpty()
    id: string;


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


}

