import { ApiProperty } from "@nestjs/swagger";

class refreshTokenDto {
    @ApiProperty()
    refresh_token: string;
}

class payloadRemoveToken {
    @ApiProperty()
    fields: string;

    @ApiProperty()
    token: string;
}


export { refreshTokenDto, payloadRemoveToken }