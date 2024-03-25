import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginUserDto, SignUpUserDto } from "src/dtos/user.dto";
import { TokenService } from "./token.service";
import { KeyService } from "./key.service";
import { Repository } from "typeorm";
import { KeyStore } from "src/typeorm/entities/key.entites";
import { InjectRepository } from "@nestjs/typeorm";
import { TokenStore } from "src/typeorm/entities/token.entity";
import { getFields } from '../../utils/getInfoData.utils'

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private tokenService: TokenService,
        private keyService: KeyService,
        @InjectRepository(KeyStore) private keyStoreRepository: Repository<KeyStore>,
        @InjectRepository(TokenStore) private tokenStoreRepository: Repository<TokenStore>,

    ) { }

    async signUp(userDetails: SignUpUserDto) {
        const { username, password, confirmPassword } = getFields(['username', 'password', 'confirmPassword'], userDetails)


        const user = await this.userService.getUser(username)
            .then(data => data ? true : false)
            .catch(err => {
                console.log(err);
                return { message: "Error sign!" }
            });


        if (user) {
            return { message: 'Username already existed!' };
        }

        if (password != confirmPassword) {
            return { message: 'Wrong confirm password!' };
        }

        const { publicKey, privateKey } = await this.keyService.createKeyPair();

        const newKeyStore = await this.keyStoreRepository.create({
            username: username,
            publicKey: publicKey,
            privateKey: privateKey
        });

        const initTokens = {
            username: username,
            refreshTokenUsed: [],
        };

        return this.userService.createUser(userDetails),
            this.keyStoreRepository.save(newKeyStore),
            this.tokenStoreRepository.save(initTokens);
    }

    async Login(userDetails: LoginUserDto) {
        const user = await this.userService.getUser(userDetails.username)
            .then(data => data)
            .catch(err => err);

        if (!user) {
            throw new NotFoundException('Not found user!')
        }


        if (userDetails.password !== user.password) {
            throw new BadRequestException("Wrong password!");
        }
        const username = userDetails.username;

        const key = await this.keyStoreRepository.findOneBy({ username })
            .then(data => data)
            .catch(err => err);

        const tokens = await this.tokenService.createTokenPair(user, key.publicKey, key.privateKey);
        if (!tokens) {
            throw new BadRequestException('Cannot create tokens!')

        }

        const filter = {
            username: username
        }

        await this.tokenStoreRepository.update(filter, tokens);
        return { message: "Login successfully!", tokens };
    }
}