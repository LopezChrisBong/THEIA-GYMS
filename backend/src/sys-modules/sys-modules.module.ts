import { Module } from '@nestjs/common';
import { SysModulesService } from './sys-modules.service';
import { SysModulesController } from './sys-modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysModule } from './entities/sys-module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysModule])],
  controllers: [SysModulesController],
  providers: [SysModulesService],
})
export class SysModulesModule {}
