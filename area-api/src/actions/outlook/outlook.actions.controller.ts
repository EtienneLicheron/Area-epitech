import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateEmailActionDto } from "../dto/create-email-action.dto";
import { OutlookActionsService } from "./outlook.actions.service";

@UseGuards(JwtAuthGuard)
@Controller("actions/outlook")
export class OutlookActionsController {
    constructor(
        private readonly outlookActionsService: OutlookActionsService,
    ) { }

    @Post("")
    async create(@Req() req: any, @Body() dto: CreateEmailActionDto): Promise<void> {
        await this.outlookActionsService.create(req.user, dto);
    }
}
