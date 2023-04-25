import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubWebhooksController } from "./github/github.webhooks.controller";
import { GithubWebhooksService } from "./github/github.webhooks.service";
import { MicrosoftWebhooksController } from "./microsoft/microsoft.webhooks.controller";
import { MicrosoftWebhooksService } from "./microsoft/microsoft.webhooks.service";
import { Webhook } from "./webhook.entity";
import { WebhooksService } from "./webhooks.service";
import { PayloadWebhooksController } from "./payload/payload.webhooks.controller";
import { PayloadWebhooksService } from "./payload/payload.webhooks.service";
import { ActionsModule } from "../actions/actions.module";
import { AccessModule } from "../access/access.module";
import { WebhooksController } from "./webhooks.controller";

@Module({
    imports: [ActionsModule, AccessModule, ConfigModule, TypeOrmModule.forFeature([Webhook]), HttpModule.registerAsync({
        imports: [ConfigModule], useFactory: async (configService: ConfigService) => ({
            timeout: configService.get("HTTP_TIMEOUT"), maxRedirects: configService.get("HTTP_MAX_REDIRECTS")
        }), inject: [ConfigService]
    })],
    controllers: [WebhooksController, PayloadWebhooksController, GithubWebhooksController, MicrosoftWebhooksController],
    providers: [WebhooksService, PayloadWebhooksService, GithubWebhooksService, MicrosoftWebhooksService],
    exports: [WebhooksService]
})
export class WebhooksModule {
}
