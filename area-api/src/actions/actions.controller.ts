import { BadRequestException, Controller, Delete, Param, ParseIntPipe, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Action } from "./action.entity";
import { ActionsService } from "./actions.service";

@UseGuards(JwtAuthGuard)
@Controller("actions")
export class ActionsController {

    constructor(
        private readonly actionsService: ActionsService
    ) {
    }

    @Delete(":id")
    async delete(@Req() req: any, @Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.actionsService.remove(req.user, id);
    }
}