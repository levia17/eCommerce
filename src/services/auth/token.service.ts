import { Injectable } from "@nestjs/common";
import { TokenParam } from "src/type/token.type";
import { TokenUtils } from "src/utils/token.utils";

const object = require('../../utils/getInfoData.utils')

@Injectable()
export class TokenService {

    constructor(
        private tokenUtils: TokenUtils
    ) { }
    
    createTokenPair(userDetails: TokenParam, publicKey, privateKey) {
        const encodedInfo = object.getFields(['username', 'role'], userDetails);

        const tokens = this.tokenUtils.createTokenPair(encodedInfo, publicKey, privateKey)
        return tokens;
    }
}