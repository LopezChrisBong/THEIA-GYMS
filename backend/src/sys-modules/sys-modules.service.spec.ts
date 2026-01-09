import { Test, TestingModule } from '@nestjs/testing';
import { SysModulesService } from './sys-modules.service';

describe('SysModulesService', () => {
  let service: SysModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysModulesService],
    }).compile();

    service = module.get<SysModulesService>(SysModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
