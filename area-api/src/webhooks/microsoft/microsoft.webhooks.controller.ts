import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateMicrosoftWebhookDto } from "../dto/create-microsoft-webhook.dto";
import { MicrosoftWebhooksService } from "./microsoft.webhooks.service";

@UseGuards(JwtAuthGuard) @Controller("webhooks/microsoft")
export class MicrosoftWebhooksController {
    constructor(private readonly microsoftWebhooksService: MicrosoftWebhooksService) {
    }

    @Get("services")
    async getServices(): Promise<Object[]> {
        return this.microsoftWebhooksService.getServices();
    }

    @Post()
    async create(@Req() req: any, @Body() dto: CreateMicrosoftWebhookDto): Promise<void> {
        await this.microsoftWebhooksService.create(req.user, dto);
    }
}
