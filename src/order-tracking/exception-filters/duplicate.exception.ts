import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class DuplicateOrderFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    let httpStatus: number;
    let responseBody: {};

    /*
    Check if it is an exception from MySQL. If it is
    relay the message from MySQL. Otherwise send a 
    generic internal server error message.
    */

    if (Object(exception).hasOwnProperty('code')) {
      httpStatus = HttpStatus.BAD_REQUEST;
      responseBody = {
        statusCode: httpStatus,
        message: [exception['message']],
        error: exception['code'],
      };
    } else if (exception instanceof BadRequestException) {
      httpStatus = exception.getStatus();
      responseBody = exception.getResponse();
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
