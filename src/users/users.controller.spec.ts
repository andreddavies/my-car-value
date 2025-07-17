import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';

describe('Testing UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      findAll: () => Promise.resolve([]),
      findOneByEmail: (email: string) =>
        Promise.resolve({
          email,
          password: '1',
        } as User),
      remove: (id: number) =>
        Promise.resolve({
          id,
          email: 'asdf@email.com',
          password: 'asddgs',
        } as User),
      update: (
        id: number,
        { email, password }: { email: string; password: string },
      ) => Promise.resolve({ id, email, password }),
    };
    const mockUserRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn().mockImplementation((userData) => ({
        id: 2,
        ...userData,
      })),
      save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
    };
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('can create an instance of user controller', async () => {
    expect(controller).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    mockUsersService.findOne = () => null;
    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('findAllUsers returns a list of users', async () => {
    const users = await controller.findAll();

    expect(users.length).toBeGreaterThan(-1);
  });

  it('findUser returns a single user with the given id', async () => {
    mockUsersService.findOne = () =>
      Promise.resolve({ id: 1, email: 'test@email.com', password: 'test' });

    const user = await controller.findOne('1');

    expect(user).toBeDefined();
  });
});
