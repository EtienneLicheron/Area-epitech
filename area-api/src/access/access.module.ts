import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AccessService } from "./access.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Application } from "../applications/application.entity";

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([Application]), HttpModule.registerAsync({
        imports: [ConfigModule], useFactory: async (configService: ConfigService) => ({
            timeout: configService.get("HTTP_TIMEOUT"), maxRedirects: configService.get("HTTP_MAX_REDIRECTS")
        }), inject: [ConfigService]
    })],
    providers: [AccessService],
    exports: [AccessService]
})

export class AccessModule {
}