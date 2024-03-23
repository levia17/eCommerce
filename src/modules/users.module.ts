import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "src/controllers/users.controller";
import { UsersService } from "src/services/users/users.service";
import { User } from "src/typeorm/entities/user.entity";
import { Repository } from "typeorm";
import { AuthModule } from "./auth.module";
import { ApiKeyService } from "src/services/apiKey/apiKey.service";
import { ApiKeyModule } from "./apiKey.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),
        ApiKeyModule
    ],
    controllers: [UsersController],
    providers: [UsersService, Repository, ApiKeyService],
    exports: [TypeOrmModule, Repository, UsersService]
})

export class UsersModule { }