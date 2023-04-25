import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.enableCors({
        origin: configService.get("WEB_HOST") + ":" + configService.get("WEB_PORT"),
        credentials: true
    });
    app.useGlobalPipes(new ValidationPipe());
    app.use(helmet());
    app.use(cookieParser());
    await app.listen(configService.get("PORT"));
}

bootstrap();
