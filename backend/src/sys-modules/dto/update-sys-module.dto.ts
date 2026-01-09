import { PartialType } from '@nestjs/swagger';
import { CreateSysModuleDto } from './create-sys-module.dto';

export class UpdateSysModuleDto extends PartialType(CreateSysModuleDto) {}
