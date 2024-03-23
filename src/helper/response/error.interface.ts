import { HttpException } from "@nestjs/common";

const { Status, ReasonStatusCode } = require('./error.constant');

export class ErrorResponse extends HttpException {

    constructor(message: string, status: number) {
        super(message, status);
    }

}