import { Test, TestingModule } from '@nestjs/testing';
import { AssignedModulesService } from './assigned-modules.service';

describe('AssignedModulesService', () => {
  let service: AssignedModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignedModulesService],
    }).compile();

    service = module.get<AssignedModulesService>(AssignedModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
