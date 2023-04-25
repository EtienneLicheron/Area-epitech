import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateAgendaActionDto } from "../dto/create-agenda-action.dto";
import { AgendaActionsService } from "./agenda.actions.service";

@UseGuards(JwtAuthGuard)
@Controller("actions/agenda")
export class AgendaActionsController {
    constructor(
        private readonly agendaActionsService: AgendaActionsService,
    ) { }

    @Post()
    async create(@Req() req: any, @Body() dto: CreateAgendaActionDto): Promise<void> {
        await this.agendaActionsService.create(req.user, dto);
    }
}
