import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request ${req.url} ...`);
    switch (req.method) {
      case 'POST':
        console.log('🚀 ~ LoggerMiddleware ~ use ~ POST');
        console.log('🚀 ~ LoggerMiddleware ~ use ~ req.body:', req.body);
        break;
      case 'GET':
        console.log('🚀 ~ LoggerMiddleware ~ use ~ GET');
        console.log('🚀 ~ LoggerMiddleware ~ use ~ req.query:', req.query);
        break;
      case 'DELETE':
        console.log('🚀 ~ LoggerMiddleware ~ use ~ DELETE');
        console.log('🚀 ~ LoggerMiddleware ~ use ~ req.query:', req.query);
        break;
      case 'PATCH':
        console.log('🚀 ~ LoggerMiddleware ~ use ~ PATCH');
        console.log('🚀 ~ LoggerMiddleware ~ use ~ req.body:', req.body);
        break;
      case 'PUT':
        console.log('🚀 ~ LoggerMiddleware ~ use ~ PUT');
        console.log('🚀 ~ LoggerMiddleware ~ use ~ req.body:', req.body);
        break;
    }
    next();
  }
}
