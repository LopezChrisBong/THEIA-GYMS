import { ApiProperty } from "@nestjs/swagger";

export class PassTokenDto {

    @ApiProperty()
    token: string;


}