import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginUserDto, SignUpUserDto } from "src/dtos/user.dto";
import { TokenService } from "./token.service";
import { KeyService } from "./key.service";
import { Repository } from "typeorm";
import { KeyStore } from "src/typeorm/entities/key.entites";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private tokenService: TokenService,
        private keyService: KeyService,
        @InjectRepository(KeyStore) private keyStoreRepository: Repository<KeyStore>,

    ) { }

    async signUp(userDetails: SignUpUserDto) {

        const user = await this.userService.getUser(userDetails.username)
            .then(data => data ? true : false)
            .catch(err => {
                console.log(err);
                return { message: "Error sign!" }
            });


        if (user) {
            return { message: 'Username already existed!' };
        }

        if (userDetails.password != userDetails.confirmPassword) {
            return { message: 'Wrong confirm password!' };
        }

        const { publicKey, privateKey } = await this.keyService.createKeyPair();

        const newKeyStore = await this.keyStoreRepository.create({
            username: userDetails.username,
            publicKey: publicKey,
            privateKey: privateKey
        });

        return this.userService.createUser(userDetails), this.keyStoreRepository.save(newKeyStore);
    }

    async Login(userDetails: LoginUserDto) {
        const user = await this.userService.getUser(userDetails.username)
            .then(data => data)
            .catch(err => err);


        if (!user) {
            return { message: "Username is not existed!" };
        }

        if (userDetails.password !== user.password) {
            return { message: "Wrong password!" };
        }
        const username = userDetails.username;

        const key = await this.keyStoreRepository.findOneBy({ username })
            .then(data => data)
            .catch(err => err);

        const tokens = await this.tokenService.createTokenPair(user, key.publicKey, key.privateKey);
        if (!tokens) {
            console.log('Error key store!');

        }

        return { message: "Login successfully!", tokens };



    }

}