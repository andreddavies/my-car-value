import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignupDto) {
    const { email, password } = body;

    this.authService.signup({ email, password });
  }

  @Post('/signin')
  signin(@Body() body: SignupDto) {
    const { email, password } = body;

    this.authService.signin({ email, password });
  }
}
