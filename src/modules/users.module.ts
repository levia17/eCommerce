import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {UsersController} from '../controllers/users.controller'
import { UsersService } from "../services/users/users.service";
import { User } from "../typeorm/entities/user.entity";
import { Repository } from "typeorm";
import { AuthModule } from "./auth.module";
import { ApiKeyService } from "../services/apiKey/apiKey.service";
import { ApiKeyModule } from "./apiKey.module";
import { TokensModule } from "./tokens.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),
        ApiKeyModule,
        TokensModule
    ],
    controllers: [UsersController],
    providers: [UsersService, Repository, ApiKeyService],
    exports: [TypeOrmModule, Repository, UsersService]
})

export class UsersModule { }