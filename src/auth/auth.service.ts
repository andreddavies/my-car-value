import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SignupDto } from './dto/signup.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  signup({ email, password }: SignupDto) {
    const user = this.userRepository.create({ email, password });

    return this.userRepository.save(user);
  }
}
