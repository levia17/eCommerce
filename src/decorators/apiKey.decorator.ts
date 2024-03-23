import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { ApiKeyGuard } from "src/guards/apiKey.guard";



function ApiKeyCheck(...ApiKey: string[]) {
    return applyDecorators(
        SetMetadata('ApiKey', ApiKey),
        UseGuards(ApiKeyGuard)
    )
}

export { ApiKeyCheck }