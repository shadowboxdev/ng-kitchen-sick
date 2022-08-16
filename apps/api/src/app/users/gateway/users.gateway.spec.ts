import 'reflect-metadata'; // not sure why this can't be included in the jest config file
import { CacheModule } from '@nestjs/common/cache/cache.module';
import { Test, TestingModule } from '@nestjs/testing';

import { UserSessionCache } from './user-session-cache';
import { UsersGateway } from './users.gateway';

describe('UsersGateway', () => {
  let gateway: UsersGateway | null = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true
        })
      ],
      providers: [UsersGateway, UserSessionCache]
    }).compile();

    gateway = module.get<UsersGateway>(UsersGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
