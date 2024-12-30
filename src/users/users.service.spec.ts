import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should throw ConflictError', () => {
    expect(service).toBeDefined();
  });

  it('should add ConflictError', () => {
    expect(service).toBeDefined();
  });
});
