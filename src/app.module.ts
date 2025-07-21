// libs
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
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
import { ConfigModule, ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true, // only use in dev env}
        };
      },
    }),
    UsersModule,
    ReportsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asjdakljda'], // dev purpose
        }),
      )
      .forRoutes('*');
  }
}
