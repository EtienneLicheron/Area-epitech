import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateTwitterActionDto } from "../dto/create-twitter-action.dto";
import { TwitterActionsService } from "./twitter.actions.service";

@UseGuards(JwtAuthGuard)
@Controller("actions/twitter")
export class TwitterActionsController {
    constructor(
        private readonly twitterActionsService: TwitterActionsService,
    ) { }

    @Post()
    async create(@Req() req: any, @Body() createTwitterActionDto: CreateTwitterActionDto): Promise<void> {
        await this.twitterActionsService.create(req.user, createTwitterActionDto);
    }
}
