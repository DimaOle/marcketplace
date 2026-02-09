import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();

    if (exception.code == 'P2002') {
      const status = HttpStatus.CONFLICT;
      const message = `${exception.meta?.target} has already been added`;

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
