import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  signup({ email, password }: SignupDto) {
    console.log(`Email: ${email} || Password: ${password}`);
  }
}
