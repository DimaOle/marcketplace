import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { Prisma } from 'src/generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();

    if (exception.code == 'P2002') {
      const status = HttpStatus.CONFLICT;
      const message = `${exception.meta.modelName} has already been added`;

      return resp.status(status).json({
        statusCode: status,
        message: message,
        error: 'Conflict',
      });
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Internal server error';

    return resp.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
