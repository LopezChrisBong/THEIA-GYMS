import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignedModuleDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  assign_mods: string;
}
