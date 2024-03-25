import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as crypto from 'node:crypto'
import { KeyStore } from "src/typeorm/entities/key.entites";
import { Repository } from "typeorm";

@Injectable()
export class KeyService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(KeyStore) private keyStoreRepository: Repository<KeyStore>,
    ) { }

    createKeyPair() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {  // Corrected the typo here
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {  // Add privateKeyEncoding options
                type: 'pkcs1',
                format: 'pem',
            },
        });

        // console.log(publicKey, privateKey);


        return { publicKey, privateKey };
    }

    async findKeyByUsername(username: string) {
        const keys = await this.keyStoreRepository.findOneBy({ username: username })
            .then(data => data)
            .catch(err => err);

        if (!keys) throw new BadRequestException('Error key!');
        return keys;
    }
}
