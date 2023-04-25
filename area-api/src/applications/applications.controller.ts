import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Application } from "./application.entity";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";

@UseGuards(JwtAuthGuard)
@Controller("applications")
export class ApplicationsController {
    constructor(
        private readonly applicationsService: ApplicationsService
    ) { }

    @Post("tekme")
    async tekmeCreate(@Req() req: any, @Body() dto: CreateApplicationDto): Promise<void> {
        await this.applicationsService.createWithToken(req.user, "Tekme", dto.token);
    }
}
