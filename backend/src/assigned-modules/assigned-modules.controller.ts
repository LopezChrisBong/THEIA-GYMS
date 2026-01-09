import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AssignedModulesService } from './assigned-modules.service';
import { CreateAssignedModuleDto } from './dto/create-assigned-module.dto';
import { UpdateAssignedModuleDto } from './dto/update-assigned-module.dto';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { currentUser } from 'src/shared/jwtDecode';

@ApiTags('Assigned Modules')
@Controller('assigned-modules')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class AssignedModulesController {
  constructor(
    private readonly assignedModulesService: AssignedModulesService,
    private jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() createAssignedModuleDto: CreateAssignedModuleDto) {
    return this.assignedModulesService.create(createAssignedModuleDto);
  }

  @Get()
  findAll() {
    return this.assignedModulesService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignedModulesService.findOne(+id);
  }

  @Get('getRemainingModules/:id')
  getRemainingModules(@Param('id') id: string) {
    return this.assignedModulesService.getRemainingModules(+id);
  }

  @Get('getMyAssignedModules/my')
  getMyAssignedModules(@Headers() headers) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.assignedModulesService.getMyAssignedModules(curr_user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssignedModuleDto: UpdateAssignedModuleDto,
  ) {
    return this.assignedModulesService.update(+id, updateAssignedModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignedModulesService.remove(+id);
  }
}
