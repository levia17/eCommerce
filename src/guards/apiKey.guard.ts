// import { Injectable, CanActivate, ExecutionContext, Req, BadRequestException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { log } from 'console';
// import { Observable } from 'rxjs';
// import { HEADER } from 'src/constants/header.constant';
// import { ApiKeyService } from 'src/services/apiKey/apiKey.service';

// @Injectable()
// export class ApiKeyGuard implements CanActivate {

//     constructor(
//         private reflector: Reflector,
//         private apiKeyService: ApiKeyService
//     ) { }

//     async canActivate(
//         context: ExecutionContext,
//     ): boolean | Promise<boolean> | Observable<boolean> {
//         const req = context.switchToHttp().getRequest();
//         const headers = req.headers;
//         const apiKey = this.reflector.get('ApiKey', context.getHandler());

//         if (!headers[HEADER.API_KEY]) {
//             throw new BadRequestException('Not enough permission!');
//         }

//         if (!apiKey.includes(headers[HEADER.API_KEY])) {
//             throw new BadRequestException('Not enough permission!');
//         }


//         try {
//             const apiKeyInstance = await this.apiKeyService.getOne(headers[HEADER.API_KEY])
//             console.log(apiKeyInstance);
//             return true
//         } catch (error) {
//             throw new BadRequestException('Cannot get api key!')
//         }


//         // if (!apiKeyInstance.status) {
//         //     throw new BadRequestException('Not enough permission!');
//         // }

//         // return true;
//     }
// }

import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HEADER } from 'src/constants/header.constant';
import { ApiKeyService } from 'src/services/apiKey/apiKey.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private apiKeyService: ApiKeyService
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const headers = req.headers;
        const apiKeyHeaderValue = headers[HEADER.API_KEY.toLowerCase()]; // HEADER.API_KEY should be lowercase
        const apiKey = this.reflector.get<string[]>('ApiKey', context.getHandler());

        if (!apiKeyHeaderValue) {
            throw new BadRequestException('API key is missing from headers.');
        }

        if (!apiKey || !apiKey.includes(apiKeyHeaderValue)) {
            throw new UnauthorizedException('Not enough permission.');
        }



        // Ensure the API key check is performed here
        try {
            const apiKeyInstance = await this.apiKeyService.getOne(apiKeyHeaderValue);
            if (!apiKeyInstance || !apiKeyInstance.status) {
                throw new UnauthorizedException('Permission denied!');
            }
            return true; // Access granted if API key is valid
        } catch (error) {
            console.log(error);

            if (error instanceof UnauthorizedException) {
                throw error;
            }

            throw new BadRequestException('Failed to validate API key.');
        }
    }
}