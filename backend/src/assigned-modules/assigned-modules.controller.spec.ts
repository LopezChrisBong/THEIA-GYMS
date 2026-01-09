import { Test, TestingModule } from '@nestjs/testing';
import { AssignedModulesController } from './assigned-modules.controller';
import { AssignedModulesService } from './assigned-modules.service';

describe('AssignedModulesController', () => {
  let controller: AssignedModulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignedModulesController],
      providers: [AssignedModulesService],
    }).compile();

    controller = module.get<AssignedModulesController>(AssignedModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
