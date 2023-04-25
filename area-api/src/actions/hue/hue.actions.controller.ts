import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { HueActionsService } from "./hue.actions.service";
import { CreateHueActionDto } from "../dto/create-hue-action.dto";

@UseGuards(JwtAuthGuard)
@Controller("actions/hue")
export class HueActionsController {

    constructor(
        private readonly hueActionsService: HueActionsService,
    ) { }

    @Get("lights")
    async getLights(@Req() req: any): Promise<[object[], number]> {
        return this.hueActionsService.getLights(req.user);
    }

    @Get("lights/:external")
    async getLight(@Req() req: any, @Param("external") external: string): Promise<object> {
        return this.hueActionsService.getLightByExternal(req.user, external);
    }

    @Get("scenes")
    async getScenes(@Req() req: any): Promise<[object[], number]> {
        return this.hueActionsService.getScenes(req.user);
    }

    @Get("scenes/:external")
    async getScene(@Req() req: any, @Param("external") external: string): Promise<object> {
        return this.hueActionsService.getSceneByExternal(req.user, external);
    }

    @Post()
    async create(@Req() req: any, @Body() dto: CreateHueActionDto): Promise<void> {
        await this.hueActionsService.create(req.user, dto);
    }
}