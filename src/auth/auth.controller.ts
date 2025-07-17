import { Body, Controller, Post, Session } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: SignupDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signup({ email, password });
    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signin(@Body() body: SignupDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signin({ email, password });
    session.userId = user.id;

    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;

    return true;
  }
}
