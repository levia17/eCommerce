import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiKeyController } from "src/controllers/apiKey.controller";
import { ApiKeyService } from "src/services/apiKey/apiKey.service";
import { ApiKey } from "src/typeorm/entities/apiKey.entites";


@Module({
    imports: [TypeOrmModule.forFeature([ApiKey])],
    controllers: [ApiKeyController],
    providers: [ApiKeyService],
    exports: [TypeOrmModule, ApiKeyService],
})

export class ApiKeyModule { }