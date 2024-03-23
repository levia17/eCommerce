import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiKeyCheck } from "src/decorators/apiKey.decorator";
import { apiKeyDto, updateApiKey } from "src/dtos/apiKey.dto";
import { ApiKeyService } from "src/services/apiKey/apiKey.service";

@ApiTags('Api Key')
@Controller('apiKey')
export class ApiKeyController {

    constructor(
        private apiKeyService: ApiKeyService
    ) { }

    @Get()
    @ApiKeyCheck('admin27017')
    getAll() {
        return this.apiKeyService.getAll();
    }

    @Get('/:apiKey')
    @ApiKeyCheck('admin27017')
    async getOne(@Param('apiKey') apikeyCode: string) {
        const apiKeyInstance = await this.apiKeyService.getOne(apikeyCode);
        if (!apiKeyInstance) {
            throw new NotFoundException('Not found ApiKey!')
        }
        return apiKeyInstance;
    }

    @Post()
    @ApiKeyCheck('admin27017')
    createKey(@Body() apiKeyDetails: apiKeyDto) {
        const apiKeyInstance = this.apiKeyService.createKey(apiKeyDetails);

        if (!apiKeyInstance) {
            throw new InternalServerErrorException("Cannot create api key!")
        }
        return apiKeyInstance;
    }


    @Patch('/:apiKeyCode')
    @ApiKeyCheck('admin27017')
    updateKey(@Param('apiKeyCode') apiKeycode: string, @Body() changedDetails: updateApiKey) {
        return this.apiKeyService.updateKey(apiKeycode, changedDetails)
    }


}