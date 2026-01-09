import { Module } from '@nestjs/common';
import { AssignedModulesService } from './assigned-modules.service';
import { AssignedModulesController } from './assigned-modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignedModule } from './entities/assigned-module.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([AssignedModule])],
  controllers: [AssignedModulesController],
  providers: [AssignedModulesService, JwtService],
})
export class AssignedModulesModule {}
