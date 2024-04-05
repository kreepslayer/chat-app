import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userModule } from './users/users.module';
import { isValidMiddleware } from './middleware/isValid.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { Get } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1/admin'), userModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.ALL });
    consumer
      .apply(isValidMiddleware)
      .forRoutes({ path: 'users/:id', method: RequestMethod.GET });
  }
}
