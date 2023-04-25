import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { catchError, firstValueFrom } from "rxjs";
import { Application } from "../../applications/application.entity";
import { User } from "../../users/user.entity";
import { Webhook } from "../../webhooks/webhook.entity";
import { Repository } from "typeorm";
import { Action } from "../action.entity";
import { CreateTwitterActionDto } from "../dto/create-twitter-action.dto";

@Injectable()
export class TwitterActionsService {
    constructor(
        @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
        private readonly httpService: HttpService
    ) {
    }

    async create(user: User, dto: CreateTwitterActionDto): Promise<Action> {
        const app: Application = await this.getApplication(user);
        const webhook: Webhook = user.applications.map((app) => app.webhooks).flat().find((webhook) => webhook.id === dto.webhook);

        if (!webhook) {
            throw new NotFoundException("Webhook not found");
        }

        const action = new Action();

        action.application = app;
        action.webhook = webhook;
        action.countdown = dto.countdown;
        action.position = webhook.actions.length;

        action.data = dto.message;

        action.id = await this.actionRepository.insert(action).then((res) => res.identifiers[0].id);

        return action;
    }

    async execute(action: Action): Promise<void> {
        await firstValueFrom(this.httpService
            .post("https://api.twitter.com/2/tweets", {
                "text": action.data + `\n\n${new Date().toLocaleString()}\n#Epitech #Area`
            }, {
                headers: {
                    "Authorization": `Bearer ${action.application.accessToken}`,
                }
            }).pipe(catchError(() => {
                throw new InternalServerErrorException();
            }))
        );
    }

    private async getApplication(user: User): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === "Twitter");

        if (!app) {
            throw new NotFoundException("Twitter application not found");
        }

        return app;
    }
}
