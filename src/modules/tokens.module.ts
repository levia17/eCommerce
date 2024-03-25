import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokensController } from "src/controllers/token.controller";
import { AuthService } from "src/services/auth/auth.service";
import { KeyService } from "src/services/auth/key.service";
import { TokenService } from "src/services/auth/token.service";
import { UsersService } from "src/services/users/users.service";
import { KeyStore } from "src/typeorm/entities/key.entites";
import { TokenStore } from "src/typeorm/entities/token.entity";
import { User } from "src/typeorm/entities/user.entity";
import { TokenUtils } from "src/utils/token.utils";
import { AuthModule } from "./auth.module";


@Module({
    imports: [TypeOrmModule.forFeature([TokenStore, KeyStore, User])],
    controllers: [TokensController],
    providers: [TokenService, TokenUtils, KeyService, AuthService, UsersService],
    exports: [TypeOrmModule, TokenService, TokenUtils],
})

export class TokensModule { }