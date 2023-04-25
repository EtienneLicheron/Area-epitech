import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { catchError, firstValueFrom } from "rxjs";
import { Application } from "../../applications/application.entity";
import { User } from "../../users/user.entity";
import { Repository } from "typeorm";
import { CreateGithubWebhookDto } from "../dto/create-github-webhook.dto";
import { GithubEventInterface } from "../interface/github-event.interface";
import { Webhook } from "../webhook.entity";
import { AccessService } from "../../access/access.service";
import { ActionsService } from "../../actions/actions.service";

@Injectable()
export class GithubWebhooksService {
    private readonly events: GithubEventInterface[];

    constructor(
        @InjectRepository(Webhook) private readonly webhookRepository: Repository<Webhook>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly accessService: AccessService,
        private readonly actionsService: ActionsService
    ) {
        this.events = JSON.parse(require("fs").readFileSync("src/constants/github_events.json", "utf8"));
    }

    async getRepositories(user: User, page: number, per_page: number): Promise<[string[], number]> {
        const app: Application = await this.getApplication(user);

        const { data } = await firstValueFrom(this.httpService
            .get(
                `https://api.github.com/user/repos?type=owner&page=${page}&per_page=${per_page}`,
                this.getHeaders(app.accessToken)
            )
            .pipe(catchError(() => {
                throw new InternalServerErrorException();
            })));

        const repositories: string[] = data.map((elem: any) => elem.name);

        return [repositories, repositories.length];
    }

    async getEvents(user: User, repository: string): Promise<[GithubEventInterface[], number]> {
        const app: Application = await this.getApplication(user);

        const githubLogin = await this.getGithubLogin(app.accessToken);

        const { data } = await firstValueFrom(this.httpService
            .get(`https://api.github.com/repos/${githubLogin}/${repository}/hooks`, this.getHeaders(app.accessToken))
            .pipe(catchError(() => {
                throw new InternalServerErrorException();
            })));

        const usedEvents = data.map((elem: any) => elem.events).flat();
        const unusedEvents = this.events.filter((event: GithubEventInterface) => !usedEvents.includes(event.event));

        return [unusedEvents, unusedEvents.length];
    }

    async create(user: User, createGithubWebhookDto: CreateGithubWebhookDto): Promise<Webhook> {
        const app: Application = await this.getApplication(user);

        const githubLogin = await this.getGithubLogin(app.accessToken);

        const { data } = await firstValueFrom(this.httpService
            .post(`https://api.github.com/repos/${githubLogin}/${createGithubWebhookDto.repository}/hooks`, {
                events: [createGithubWebhookDto.event], config: {
                    url: `${this.configService.get("HOST")}:${this.configService.get("PORT")}/webhooks/payload/github`,
                    content_type: "json"
                }
            }, this.getHeaders(app.accessToken))
            .pipe(catchError(() => {
                throw new InternalServerErrorException();
            })));

        const webhook: Webhook = new Webhook();

        webhook.external = data.id;
        webhook.event = createGithubWebhookDto.event;
        webhook.argument = createGithubWebhookDto.repository;
        webhook.application = app;
        webhook.id = await this.webhookRepository.insert(webhook).then((res: any) => res.identifiers[0].id);

        return webhook;
    }

    async removeByApplication(application: Application): Promise<void> {
        for (const webhook of application.webhooks) {
            await this.remove(webhook);
        }
    }

    async remove(webhook: Webhook): Promise<void> {
        const githubLogin = await this.getGithubLogin(webhook.application.accessToken);

        await firstValueFrom(this.httpService
            .delete(
                `https://api.github.com/repos/${githubLogin}/${webhook.argument}/hooks/${webhook.external}`,
                this.getHeaders(webhook.application.accessToken)
            )
            .pipe(catchError(() => {
                return "";
            })));

        for (const action of webhook.actions) {
            await this.actionsService.removeById(action.id);
        }

        await this.webhookRepository.remove(webhook);
    }

    private getHeaders(token: any): object {
        return {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        };
    }

    private async getApplication(user: User): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === 'Github');

        if (!app) {
            throw new NotFoundException("Github application not found");
        }

        return await this.accessService.refresh(app);
    }

    private async getGithubLogin(token: string): Promise<string> {
        const { data } = await firstValueFrom(this.httpService
            .get(`https://api.github.com/user`, this.getHeaders(token))
            .pipe(catchError(() => {
                throw new InternalServerErrorException();
            })));

        return data.login;
    }
}
