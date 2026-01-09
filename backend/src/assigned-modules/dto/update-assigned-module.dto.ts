import { PartialType } from '@nestjs/swagger';
import { CreateAssignedModuleDto } from './create-assigned-module.dto';

export class UpdateAssignedModuleDto extends PartialType(CreateAssignedModuleDto) {}
