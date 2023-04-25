import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateTekmeActionDto } from "../dto/create-tekme-action.dto";
import { TekmeActionsService } from "./tekme.actions.service";

@UseGuards(JwtAuthGuard)
@Controller("actions/tekme")
export class TekmeActionsController {
    constructor(
        private readonly tekmeActionsService: TekmeActionsService,
    ) { }

    @Get("doors")
    async getDoors(@Req() req: any): Promise<[object[], number]> {
        return this.tekmeActionsService.getDoors(req.user);
    }

    @Post()
    async create(@Req() req: any, @Body() dto: CreateTekmeActionDto): Promise<void> {
        await this.tekmeActionsService.create(req.user, dto);
    }
}
