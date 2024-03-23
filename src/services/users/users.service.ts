import { Injectable, NotFoundException, UseFilters } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserParam, DeleteUserParam, UpdateUserParam } from "src/type/user.type";
import { User } from "src/typeorm/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    getUsers() {
        return this.userRepository.find();
    }

    async getUser(username: string) {
        return this.userRepository.findOneBy({ username });
    }


    async createUser(userDetails: CreateUserParam) {
        const newUser = await this.userRepository.create({ ...userDetails, createAt: new Date() })
        return this.userRepository.save(newUser);
    }

    async updateUser(username: string, userDetails: UpdateUserParam) {
        return this.userRepository.update(username, userDetails);
    }

    deleteUser(userDetails: DeleteUserParam) {
        return this.userRepository.delete(userDetails);
    }
}