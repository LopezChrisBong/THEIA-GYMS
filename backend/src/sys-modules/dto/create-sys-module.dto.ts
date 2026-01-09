import { ApiProperty } from '@nestjs/swagger';

export class CreateSysModuleDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  route: string;

  @ApiProperty()
  parentID: number;

  @ApiProperty()
  isParent: boolean;
}
