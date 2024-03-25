import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { TokenParam } from "src/type/token.type";
import { KeyStore } from "src/typeorm/entities/key.entites";
import { TokenUtils } from "src/utils/token.utils";
import { Repository } from "typeorm";
import { KeyService } from "./key.service";
import { getFields } from "src/utils/getInfoData.utils";
import { payloadRemoveToken } from "src/dtos/token.dto";
import { UsersService } from "../users/users.service";
import { TokenStore } from "src/typeorm/entities/token.entity";

const object = require('../../utils/getInfoData.utils')

@Injectable()
export class TokenService {

    constructor(
        private tokenUtils: TokenUtils,
        private jwtService: JwtService,
        private keyService: KeyService,
        private userService: UsersService,
        @InjectRepository(KeyStore) private keyStoreRepository: Repository<KeyStore>,
        @InjectRepository(TokenStore) private tokenStoreRepository: Repository<TokenStore>
    ) { }

    createTokenPair(userDetails: TokenParam, publicKey, privateKey) {
        const encodedInfo = object.getFields(['username', 'role'], userDetails);

        const tokens = this.tokenUtils.createTokenPair(encodedInfo, publicKey, privateKey)
        return tokens;
    }

    async handleRefreshToken(username: string, refresh_token: string) {
        const user = await this.userService.getUser(username)
            .then(data => data)
            .catch(err => err);
        if (!user) {
            throw new NotFoundException('User is not existed!')
        }

        const keys = await this.keyService.findKeyByUsername(username)
            .then(data => data)
            .catch(err => err);

        const verify = await this.jwtService.verify(refresh_token, { publicKey: keys.publicKey });
        if (!verify) throw new UnauthorizedException('Invalid!');

        const refreshTokenCheck = await this.tokenUtils.findByRefreshTokenUsed(username, refresh_token)
            .then(data => {
                if (data.checkOverlap.toString() !== '') throw new BadRequestException('Error RT!');

                return data.refreshTokenUsed;
            })
            .catch(err => {
                // console.error(err);
                throw new BadRequestException('Invalid refresh token! 1');
            });

        // console.log('Check refresh token used!', refreshTokenCheck);

        if (refreshTokenCheck) throw new BadRequestException('Invalid refresh token! 2');

        const holderToken = this.tokenUtils.findByRefreshToken(username, refresh_token);

        if (!holderToken) throw new BadRequestException('Invalid refresh token! 3');

        const key = await this.keyStoreRepository.findOneBy({ username })
            .then(data => data)
            .catch(err => err);

        const encodedInfo = object.getFields(['username', 'role'], user);

        const tokens = await this.tokenUtils.createTokenPair(encodedInfo, key.publicKey, key.privateKey);
        if (!tokens) {
            throw new BadRequestException('Cannot create tokens!')

        }

        const filter = {
            username: username
        }

        await this.tokenStoreRepository.update(filter, tokens);

        return this.tokenUtils.addToRefreshTokenUsed(username, refresh_token);
    }

    findByUsername(username: string) {
        return this.tokenUtils.findByUsername(username);
    }


    removeTokensByUsername(username: string, payload: payloadRemoveToken) {
        const { fields, token } = getFields(['fields', 'token'], payload)
        // console.log(fields);

        return this.tokenUtils.removeTokensByUsername(username, token, fields);
    }
}