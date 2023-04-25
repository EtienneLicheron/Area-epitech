import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Application } from "./application.entity";
import { ApplicationsService } from "./applications.service";
import { WebhooksModule } from "../webhooks/webhooks.module";
import { ActionsModule } from "../actions/actions.module";
import { ApplicationsController } from "./applications.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [ActionsModule, WebhooksModule, ConfigModule, TypeOrmModule.forFeature([Application]), HttpModule.registerAsync({
        imports: [ConfigModule], useFactory: async (configService: ConfigService) => ({
            timeout: configService.get("HTTP_TIMEOUT"), maxRedirects: configService.get("HTTP_MAX_REDIRECTS")
        }), inject: [ConfigService]
    })],
    controllers: [ApplicationsController],
    providers: [ApplicationsService],
    exports: [ApplicationsService]
})
export class ApplicationsModule {
}
