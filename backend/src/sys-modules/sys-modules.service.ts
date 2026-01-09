import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSysModuleDto } from './dto/create-sys-module.dto';
import { UpdateSysModuleDto } from './dto/update-sys-module.dto';
import { SysModule } from './entities/sys-module.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SysModulesService {
  constructor(
    @InjectRepository(SysModule)
    private readonly sysModRepo: Repository<SysModule>,
  ) {}
  async create(createSysModuleDto: CreateSysModuleDto) {
    try {
      const newModule = this.sysModRepo.create(createSysModuleDto);
      await this.sysModRepo.save(newModule);
      return {
        msg: 'Module Saved',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        msg: 'Saving failed!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async findAll() {
    const sm = await this.sysModRepo.find();
    for (let i = 0; i < sm.length; i++) {
      let element = sm[i];

      if (element.isParent == true) {
        Object.assign(sm[i], { subLink: [] });
      }
    }
    return sm;
  }

  async getParentModules() {
    return await this.sysModRepo
      .createQueryBuilder('sm')
      .where('sm.isParent = true')
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} sysModule`;
  }

  async update(id: number, updateSysModuleDto: UpdateSysModuleDto) {
    try {
      await this.sysModRepo.update(id, updateSysModuleDto);
      return {
        msg: 'Module Saved',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        msg: 'Saving failed!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} sysModule`;
  }
}
