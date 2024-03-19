import { Injectable } from "@nestjs/common";
import * as crypto from 'node:crypto'

@Injectable()
export class KeyService {
    constructor() { }

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

        console.log(publicKey, privateKey);
        

        return { publicKey, privateKey };
    }
}
