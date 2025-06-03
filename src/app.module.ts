// libs
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// app
import { AppController } from './app.controller';
import { AppService } from './app.service';

// features
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

import { Report } from './reports/entities/report.entity';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'my-car-value.db.sqlite',
      entities: [User, Report],
      synchronize: true, // only use in dev env
    }),
    UsersModule,
    ReportsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
