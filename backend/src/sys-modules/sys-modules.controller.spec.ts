import { Test, TestingModule } from '@nestjs/testing';
import { SysModulesController } from './sys-modules.controller';
import { SysModulesService } from './sys-modules.service';

describe('SysModulesController', () => {
  let controller: SysModulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysModulesController],
      providers: [SysModulesService],
    }).compile();

    controller = module.get<SysModulesController>(SysModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
