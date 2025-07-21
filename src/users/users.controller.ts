import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    this.usersService.update(id, body);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
