import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomLogger } from './logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly customLogger: CustomLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const request = ctx.getRequest();

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    const stack =
      exception instanceof HttpException && (exception as any).stack
        ? (exception as any).stack
        : null;

    this.customLogger.error(
      `Request method: ${request.method} HTTP Status: ${httpStatus} Error Message: ${message}`,
      stack,
      ctx.getRequest().url,
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
