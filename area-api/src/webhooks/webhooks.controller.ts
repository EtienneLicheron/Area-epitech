import { BadRequestException, Controller, Delete, Param, ParseIntPipe, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { WebhooksService } from "./webhooks.service";

@UseGuards(JwtAuthGuard)
@Controller("webhooks")
export class WebhooksController {
    constructor(
        private readonly webhooksService: WebhooksService
    ) { }

    @Delete(":id")
    async delete(@Req() req: any, @Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.webhooksService.remove(req.user, id);
    }
}