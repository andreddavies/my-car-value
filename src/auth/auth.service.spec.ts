import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Testing AuthService', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      findAll: () => Promise.resolve([]),
      findOneByEmail: (email: string) =>
        Promise.resolve({
          email,
          password: '1',
        } as User),
      update: (
        id: number,
        { email, password }: { email: string; password: string },
      ) => Promise.resolve({ id, email, password, admin: false, reports: [] }),
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
      providers: [
        AuthService,
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

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup({
      email: 'email@email.com',
      password: 'lkajdsaklj',
    });

    expect(user).toBeDefined();
    expect(user.password).toBeDefined();
    expect(user.password).not.toEqual('asdf');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    mockUsersService.findOneByEmail = () =>
      Promise.resolve({
        id: 15,
        email: 'asdf@asdf.com',
        password: 'asdf',
        admin: false,
        reports: [],
      });

    await expect(
      service.signup({
        email: 'asdf@asdf.com',
        password: 'asdf',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an invalid email', async () => {
    mockUsersService.findOneByEmail = () => Promise.resolve(undefined);

    await expect(
      service.signin({
        email: 'asdflkj@asdlfkj.com',
        password: 'passdflkj',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    mockUsersService.findOneByEmail = () =>
      Promise.resolve({
        email: 'laskdjf@alskdfj.com',
        password: 'laskdjf',
      } as User);

    await expect(
      service.signin({
        email: 'laskdjf@alskdfj.com',
        password: '1',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    mockUsersService.findOneByEmail = (email: string) =>
      Promise.resolve({
        id: 15,
        email,
        password:
          'b9ed4db9a68b562e.927ffb708390922efafbe79cafbefb747ad3d827d7cbb12fe3b76300359a0fc9',
      } as User);

    const user = await service.signin({
      email: 'teste@email.com',
      password: 'testPass',
    });

    expect(user).toBeDefined();
  });
});
