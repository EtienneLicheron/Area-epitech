import { Controller, Header, HttpCode, Post, Query, Req } from "@nestjs/common";
import { PayloadWebhooksService } from "./payload.webhooks.service";

@Controller("webhooks/payload")
export class PayloadWebhooksController {
    constructor(
        private readonly payloadWebhooksService: PayloadWebhooksService
    ) {
    }

    @Post("github")
    async github(@Req() req: any): Promise<void> {
        await this.payloadWebhooksService.githubPayload(req.headers);
    }

    @Post("microsoft")
    @Header("Content-Type", "text/plain")
    async microsoft(@Req() req: any, @Query("validationToken") validationToken: string): Promise<void> {
        await this.payloadWebhooksService.microsoftPayload(req, validationToken);
    }
}
