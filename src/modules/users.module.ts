import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "src/controllers/users.controller";
import { UsersService } from "src/services/users/users.service";
import { User } from "src/typeorm/entities/user.entity";
import { Repository } from "typeorm";
import { AuthModule } from "./auth.module";
import { APP_FILTER } from "@nestjs/core";


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),
    ],
    controllers: [UsersController],
    providers: [UsersService, Repository],
    exports: [TypeOrmModule, Repository, UsersService]
})

export class UsersModule { }