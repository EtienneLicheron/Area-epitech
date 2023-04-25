import { Client } from "@microsoft/microsoft-graph-client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Application } from "../../applications/application.entity";
import { User } from "../../users/user.entity";
import { Webhook } from "../../webhooks/webhook.entity";
import { Repository } from "typeorm";
import { Action } from "../action.entity";
import { CreateCalendarActionDto } from "../dto/create-calendar-action.dto";
import { CalendarActionsInterface } from "../interface/calendar.actions.interface";

@Injectable()
export class CalendarActionsService {
    constructor(
        @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
    ) { }

    async create(user: User, dto: CreateCalendarActionDto): Promise<Action> {
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

        const actionData: CalendarActionsInterface = {
            type: "Calendar",
            title: dto.title
        };

        action.data = JSON.stringify(actionData);

        action.id = await this.actionRepository.insert(action).then((res) => res.identifiers[0].id);

        return action;
    }

    async execute(action: Action): Promise<void> {
        const data: CalendarActionsInterface = JSON.parse(action.data);

        const client = Client.init({
            authProvider: (done: any) => {
                done(null, action.application.accessToken);
            }
        });

        const event = {
            subject: data.title,
            start: {
                dateTime: new Date().toISOString(),
                timeZone: "UTC"
            },
            end: {
                dateTime: new Date().toISOString(),
                timeZone: "UTC"
            }
        };

        await client.api("/me/events").post(event);
    }

    private async getApplication(user: User): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === "Microsoft");

        if (!app) {
            throw new NotFoundException("Microsoft application not found");
        }

        return app;
    }
}
