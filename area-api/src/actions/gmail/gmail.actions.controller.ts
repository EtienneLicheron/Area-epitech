import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateEmailActionDto } from "../dto/create-email-action.dto";
import { GmailActionsService } from "./gmail.actions.service";

@UseGuards(JwtAuthGuard)
@Controller("actions/gmail")
export class GmailActionsController {
    constructor(
        private readonly gmailActionsService: GmailActionsService,
    ) { }

    @Post()
    async create(@Req() req: any, @Body() dto: CreateEmailActionDto): Promise<void> {
        await this.gmailActionsService.create(req.user, dto);
    }
}
