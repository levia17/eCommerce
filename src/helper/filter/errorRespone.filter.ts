import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { ErrorResponse } from 'src/helper/response/error.interface';

@Catch(ErrorResponse)
export class ErrorResponseFilter implements ExceptionFilter {
    catch(exception: ErrorResponse, host: ArgumentsHost) {
        console.log('hi!');

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.status;

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
                message: exception.message,
            });
    }
}