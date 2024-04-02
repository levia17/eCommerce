import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

class refreshTokenDto {
    @ApiProperty()
    @IsString()
    refresh_token: string;
}

class payloadRemoveToken {
    @ApiProperty()
    @IsString()
    fields: string;

    @ApiProperty()
    @IsString()
    token: string;
}


export { refreshTokenDto, payloadRemoveToken }