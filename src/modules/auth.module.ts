import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "src/services/auth/auth.service";
import { UsersModule } from "./users.module";
import { TokenService } from "src/services/auth/token.service";
import { KeyService } from "src/services/auth/key.service";
import { TokenUtils } from "src/utils/token.utils";
import { KeyStore } from "src/typeorm/entities/key.entites";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenStore } from "src/typeorm/entities/token.entity";
import { TokensModule } from "./tokens.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([KeyStore, TokenStore]),
        forwardRef(() => UsersModule), TokensModule,
    ],
    providers: [AuthService, TokenService, KeyService, TokenUtils],
    exports: [TypeOrmModule, AuthService, TokenService, KeyService],

})

export class AuthModule { }