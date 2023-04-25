import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateGithubWebhookDto } from "../dto/create-github-webhook.dto";
import { GithubWebhooksService } from "./github.webhooks.service";

@UseGuards(JwtAuthGuard) @Controller("webhooks/github")
export class GithubWebhooksController {
    constructor(private readonly githubWebhooksService: GithubWebhooksService) {
    }

    @Get("repositories")
    async getRepositories(@Req() req: any,
        @Query("page") page = 1,
        @Query("per_page") per_page = 100
    ): Promise<[string[], number]> {
        if (Number.isNaN(+page) || Number.isNaN(+per_page) || +per_page > 100) {
            throw new BadRequestException("Bad query parameters");
        }
        return this.githubWebhooksService.getRepositories(req.user, +page, +per_page);
    }

    @Get("events/:repository")
    async getEvents(@Req() req: any, @Param("repository") repository: string): Promise<[object[], number]> {
        return this.githubWebhooksService.getEvents(req.user, repository);
    }

    @Post()
    async create(@Req() req: any, @Body() dto: CreateGithubWebhookDto): Promise<void> {
        await this.githubWebhooksService.create(req.user, dto);
    }
}
