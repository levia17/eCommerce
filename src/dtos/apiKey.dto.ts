import { ApiProperty } from "@nestjs/swagger";

class apiKeyDto {
    @ApiProperty()
    apiKeyCode: string;

    @ApiProperty()
    status: boolean;

    @ApiProperty()
    permission: string;

}

class updateApiKey {
    @ApiProperty()
    status: boolean;
}

export { apiKeyDto, updateApiKey }