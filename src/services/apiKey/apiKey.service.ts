import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { apiKeyParam } from "src/type/apiKey.type";
import { ApiKey } from "src/typeorm/entities/apiKey.entites";
import { Repository } from "typeorm";


@Injectable()
export class ApiKeyService {

    constructor(
        @InjectRepository(ApiKey) private apiKeyRepository: Repository<ApiKey>
    ) { }

    getAll() {
        return this.apiKeyRepository.find();
    }

    getOne(apiKeyCode: string) {
        return this.apiKeyRepository.findOneBy({ apiKeyCode });
    }

    async createKey(apiKeyDetails: apiKeyParam) {
        const newKey = this.apiKeyRepository.create({ ...apiKeyDetails, createAt: new Date() })
        return this.apiKeyRepository.save(newKey);
    }

    updateKey(apiKeyCode: string, changedDetails: object) {
        return this.apiKeyRepository.update(apiKeyCode, changedDetails);
    }

}