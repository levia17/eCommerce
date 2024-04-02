import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

class apiKeyDto {
    @ApiProperty()
    @IsString()
    apiKeyCode: string;

    @ApiProperty()
    @IsBoolean()
    status: boolean;

    @ApiProperty()
    @IsString()
    permission: string;

}

class updateApiKey {
    @ApiProperty()
    @IsBoolean()
    status: boolean;
}

export { apiKeyDto, updateApiKey }