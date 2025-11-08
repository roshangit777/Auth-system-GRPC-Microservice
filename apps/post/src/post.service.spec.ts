import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Posts } from './entity/post.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('PostService', () => {
  let service: PostService;

  //mocks
  let usePostsRepository: any;
  let cachManager: any;
  /* let postListCacheKeys: any; */

  beforeEach(async () => {
    usePostsRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
      leftJoinAndSelect: jest.fn(),
      getManyAndCount: jest.fn(),
      orderBy: jest.fn(),
      skip: jest.fn(),
      take: jest.fn(),
    };

    cachManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    /* postListCacheKeys = {
      add: jest.fn(),
      clear: jest.fn(),
    }; */

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Posts),
          useValue: usePostsRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cachManager,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
