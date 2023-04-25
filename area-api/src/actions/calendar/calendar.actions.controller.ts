import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateCalendarActionDto } from "../dto/create-calendar-action.dto";
import { CalendarActionsService } from "./calendar.actions.service";

@UseGuards(JwtAuthGuard)
@Controller("actions/calendar")
export class CalendarActionsController {
    constructor(
        private readonly calendarActionsService: CalendarActionsService,
    ) { }

    @Post()
    async create(@Req() req: any, @Body() dto: CreateCalendarActionDto): Promise<void> {
        await this.calendarActionsService.create(req.user, dto);
    }
}
