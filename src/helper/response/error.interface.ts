const { Status, ReasonStatusCode } = require('./error.constant');

export class ErrorResponse extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status
    }

}

export class NotFoundRequest extends ErrorResponse {
    constructor(message?: string, status?: number) {
        super(message || ReasonStatusCode.NOTFOUND, status || Status.NOTFOUND);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorResponse);
        }

    }
}