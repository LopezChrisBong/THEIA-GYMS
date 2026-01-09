import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SysModulesService } from './sys-modules.service';
import { CreateSysModuleDto } from './dto/create-sys-module.dto';
import { UpdateSysModuleDto } from './dto/update-sys-module.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';

@ApiTags('System Modules')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
@Controller('sys-modules')
export class SysModulesController {
  constructor(private readonly sysModulesService: SysModulesService) {}

  @Post()
  create(@Body() createSysModuleDto: CreateSysModuleDto) {
    return this.sysModulesService.create(createSysModuleDto);
  }

  @Get('getParentModules')
  getParentModules() {
    return this.sysModulesService.getParentModules();
  }

  @Get()
  findAll() {
    return this.sysModulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sysModulesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSysModuleDto: UpdateSysModuleDto,
  ) {
    return this.sysModulesService.update(+id, updateSysModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sysModulesService.remove(+id);
  }
}
