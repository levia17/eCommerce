import { BadRequestException, Injectable, NotFoundException, UseFilters } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { error } from "node:console";
import { CreateUserParam, DeleteUserParam, UpdateUserParam } from "src/type/user.type";
import { KeyStore } from "src/typeorm/entities/key.entites";
import { TokenStore } from "src/typeorm/entities/token.entity";
import { User } from "src/typeorm/entities/user.entity";
import { ValidationUtils } from "src/utils/validation.util";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(KeyStore) private keyStoreRepository: Repository<KeyStore>,
        @InjectRepository(TokenStore) private tokenStoreRepository: Repository<TokenStore>,
    ) { }

    getUsers() {
        return this.userRepository.find();
    }

    getUser(username: string) {


        return this.userRepository.findOneBy({ username });
    }


    async createUser(userDetails: CreateUserParam) {
        const newUser = this.userRepository.create({
            ...userDetails,
            createdAt: new Date()
        })
        console.log(newUser);

        return this.userRepository.save(newUser);
    }

    async updateUser(username: string, userDetails: UpdateUserParam) {

        const validation = ValidationUtils(['password', 'email'], userDetails);

        if (!validation) {
            throw new BadRequestException('Invalid!');
        }

        const user = await this.userRepository.findOneBy({ username: username })
            .then(data => data)
            .catch(err => {
                throw new Error(err)
            });
        if (!user) {
            throw new NotFoundException("User is not existed!")
        }

        return this.userRepository.update(username, userDetails);
    }

    deleteUser(userDetails: DeleteUserParam) {
        this.keyStoreRepository.delete(userDetails);
        this.tokenStoreRepository.delete(userDetails);
        return this.userRepository.delete(userDetails);
    }
}