import { Module } from "@nestjs/common";
import { ShopController } from "src/controllers/shop.controller";
import { ShopService } from "src/services/shop/shop.service";
import { TokensModule } from "./tokens.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Shop } from "src/typeorm/entities/shop.entites";
import { User } from "src/typeorm/entities/user.entity";
import { TokenUtils } from "src/utils/token.utils";


@Module({
    imports: [TypeOrmModule.forFeature([Shop, User]), TokensModule],
    providers: [ShopService, TokenUtils],
    controllers: [ShopController],
    exports: [],
})

export class ShopModule { }