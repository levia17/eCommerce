import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenUtils {
    constructor(
        private jwtService: JwtService,
    ) { }

    createTokenPair(payload: object, publicKey: string, privateKey: string) {
        const access_token = this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: privateKey,
            expiresIn: '2h',
        })

        const refresh_token = this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: privateKey,
            expiresIn: '7d',
        });

        const verifyToken = this.jwtService.verify(access_token, {
            algorithms: ["RS256"], publicKey: publicKey
        })

        if (!verifyToken) {
            return { message: 'Error verify token!' }
        }

        return { access_token, refresh_token };
    }
}
