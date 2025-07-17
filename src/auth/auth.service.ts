import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';

import { SignupDto } from './dto/signup.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async signup({ email, password }: SignupDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user?.id) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashPassword = `${salt}.${hash.toString('hex')}`;

    const newUser = this.userRepository.create({
      email,
      password: hashPassword,
    });

    return this.userRepository.save(newUser);
  }

  async signin({ email, password }: SignupDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    const [salt, storedHash] = user.password.split('.');

    const currentHash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== currentHash.toString('hex'))
      throw new BadRequestException('Email or Password invalid');

    return user;
  }
}
