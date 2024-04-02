import { DocumentBuilder } from "@nestjs/swagger";

const configApi = new DocumentBuilder()
    .setTitle('API eCommerce')
    .setDescription('The api eCommerce')
    .setVersion('1.0')
    .addSecurity('bearer', {
        type: 'http',
        bearerFormat: 'JWT',
        scheme: 'bearer'
    })
    .addSecurityRequirements('bearer')
    .build();

export { configApi }