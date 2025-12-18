import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CustomLogger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly customLogger: CustomLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { method, baseUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      this.customLogger.log(
        `[${method}] ${baseUrl} - Status: ${statusCode} - Query: ${JSON.stringify(
          query,
        )} - Body: ${JSON.stringify(body)}`,
        'HTTP',
      );
    });

    next();
  }
}
