import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

@Injectable()
export class isValidMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.url == '/users') {
      console.log('ure looking 4 all users');
      next();
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('🚀 ~ isValidMiddleware ~ use ~ id:', id);
      throw new HttpException('Invalid ID :(', 400);
    }
    console.log('🚀 ~ isValidMiddleware ~ use ~ id:', id);
    next();
  }
}
