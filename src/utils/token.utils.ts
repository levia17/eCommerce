import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { KeyStore } from "src/typeorm/entities/key.entites";
import { TokenStore } from "src/typeorm/entities/token.entity";
import { Repository } from "typeorm";

@Injectable()
export class TokenUtils {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(TokenStore) private tokenStoreRepository: Repository<TokenStore>,
        @InjectRepository(KeyStore) private keyStoreRepository: Repository<KeyStore>
    ) { }

    createTokenPair(payload: object, publicKey: string, privateKey: string) {
        const access_token = this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: privateKey,
            expiresIn: '2h',
        })

        const refresh_token = this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: privateKey,
            expiresIn: '7d',
        });

        const verifyToken = this.jwtService.verify(access_token, {
            algorithms: ["RS256"], publicKey: publicKey
        })

        if (!verifyToken) {
            return { message: 'Error verify token!' }
        }

        return { access_token, refresh_token };
    }

    async findByUsername(username: string) {
        return this.tokenStoreRepository.findOneBy({ username })
    }

    async findByRefreshTokenUsed(username: string, refresh_token: string) {

        const safeToken = JSON.stringify(refresh_token);

        const query = this.tokenStoreRepository.createQueryBuilder('token_store');

        const refreshTokenUsed = await query
            .where(`username = :username`, { username })
            .andWhere(`JSON_CONTAINS(refreshTokenUsed, :token)`, {
                token: safeToken, // Ensure the token is double-quoted as JSON strings are
            })
            .getOne();

        const checkOverlap = await query
            .where(`username <> :username`, { username })
            .andWhere(`JSON_CONTAINS(refreshTokenUsed, :token)`, {
                token: safeToken, // Ensure the token is double-quoted as JSON strings are
            })
            .getMany();

        return { refreshTokenUsed, checkOverlap };
    }

    async findByRefreshToken(username: string, refresh_token: string) {
        const entity = this.tokenStoreRepository.findOneBy({ username: username, refresh_token: refresh_token })
        return entity ? entity : false;
    }

    async addToRefreshTokenUsed(username: string, refresh_token: string) {
        await this.tokenStoreRepository
            .createQueryBuilder()
            .update('token_store')
            .set({
                refreshTokenUsed: () => `JSON_ARRAY_APPEND(refreshTokenUsed, '$', '${refresh_token}')`
            })
            .where(`username = :username`, { username })
            .execute()
    }

    async removeTokenPairByUsername(username: string) {
        return await this.tokenStoreRepository.update({ username: username }, {
            access_token: null,
            refresh_token: null
        })
            .then(data => { message: "Reset Successfully!" })
            .catch(err => { throw new InternalServerErrorException() });
    }

    async removeTokensByUsername(username: string, tokenToRemove: string, field: string) {

        let response;

        // Find the JSON array index of the token to remove
        const user = await this.tokenStoreRepository.findOneBy({ username: username });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        switch (field) {
            case 'refreshTokenUsed':
                // Assuming refreshTokenUsed is the name of your JSON array column
                const index = user.refreshTokenUsed.indexOf(tokenToRemove);
                if (index === -1) {
                    throw new NotFoundException(`Token not found in user's refreshTokenUsed`);
                }

                // Use JSON_REMOVE to delete the token at the specified index
                await this.tokenStoreRepository
                    .createQueryBuilder()
                    .update('token_store')
                    .set({
                        refreshTokenUsed: () => `JSON_REMOVE(refreshTokenUsed, '$[${index}]')`
                    })
                    .where("username = :username", { username })
                    .execute();
                response = { message: 'Deleted token!' };
                return response;

            case 'access_token':
                const checkAT = await this.tokenStoreRepository.findOneBy({ username, refresh_token: tokenToRemove })

                if (!checkAT) {
                    throw new NotFoundException(`Not found user's token!`)
                }

                await this.tokenStoreRepository.update({ username: username }, { access_token: null })
                    .then(data => {
                        console.log('delete AT', data);
                        response = { message: 'Deleted token!' };
                        return response;
                    })
                    .catch(err => err);
            case 'refresh_token':
                const checkRT = await this.tokenStoreRepository.findOneBy({ username, refresh_token: tokenToRemove })

                if (!checkRT) {
                    throw new NotFoundException(`Not found user's token!`)
                }

                await this.tokenStoreRepository.update({ username: username }, { refresh_token: null })
                    .then(data => {
                        console.log('delete RT', data);
                        response = { message: 'Deleted token!' };
                        return response;
                    })
                    .catch(err => err);

            default:
                return response;
        }

    }
}
