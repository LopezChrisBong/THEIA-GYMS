import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class SearchUserDetailDto {

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    fullname: string





}
