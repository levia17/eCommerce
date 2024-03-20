import { SwaggerModule } from "@nestjs/swagger";
import { configApi } from "./config.swagger";

function ApiSwagger(app) {
    const document = SwaggerModule.createDocument(app, configApi)
    SwaggerModule.setup('v1/api', app, document);
}

export { ApiSwagger }