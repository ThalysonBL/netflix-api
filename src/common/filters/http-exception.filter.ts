import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

const STATUS_ERROR_LABEL: Partial<Record<number, string>> = {
  [HttpStatus.BAD_REQUEST]: 'Requisição inválida',
  [HttpStatus.UNAUTHORIZED]: 'Não autorizado',
  [HttpStatus.FORBIDDEN]: 'Acesso negado',
  [HttpStatus.NOT_FOUND]: 'Não encontrado',
  [HttpStatus.CONFLICT]: 'Conflito',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Entidade não processável',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor',
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorLabel =
      exception instanceof HttpException
        ? (exception.getResponse() as { error?: string })?.error
        : undefined;

    const message =
      exception instanceof HttpException
        ? this.getExceptionMessage(exception)
        : 'Erro interno do servidor';

    const errorLabelRes = STATUS_ERROR_LABEL[status] ?? errorLabel ?? 'Erro';

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.url} ${status}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    res.status(status).json({
      status_code: status,
      message,
      error: errorLabelRes,
    });
  }

  private getExceptionMessage(exception: HttpException): string | string[] {
    const response = exception.getResponse();
    if (typeof response === 'object' && response !== null && 'message' in response) {
      return (response as { message: string | string[] }).message;
    }
    return exception.message;
  }
}
