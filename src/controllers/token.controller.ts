import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services/auth/auth.service";

import { payloadRemoveToken, refreshTokenDto } from "src/dtos/token.dto";
import { TokenService } from "src/services/auth/token.service";

@ApiTags('Tokens')
@Controller('/tokens')
// @ApiKeyCheck('admin2017')
export class TokensController {
    constructor(
        private tokenService: TokenService,
    ) { }

    @Get('/:username')
    async getByUsername(@Param('username') username: string) {
        const tokens = await this.tokenService.findByUsername(username);
        if (!tokens) {
            throw new NotFoundException(`Cannot found user's token!`)
        }
        return tokens;
    }


    @Post('/:username')
    handleRefreshToken(@Param('username') username: string, @Body() refresh_token: refreshTokenDto) {
        return this.tokenService.handleRefreshToken(username, refresh_token.refresh_token.toString());
    }

    @Delete('/:username')
    removeTokensByUSername(@Param('username') username: string, @Body() payload: payloadRemoveToken) {
        return this.tokenService.removeTokensByUsername(username, payload)
    }
}
