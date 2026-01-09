import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class SendNewEmailDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    invoiceID: number


    @ApiProperty()
    @IsNotEmpty()
    email: string


    @ApiProperty()
    @Optional()
    note: string
}
