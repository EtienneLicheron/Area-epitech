import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Application } from "../../applications/application.entity";
import { User } from "../../users/user.entity";
import { Repository } from "typeorm";
import { Action } from "../action.entity";
import { ConfigService } from "@nestjs/config";
import { CreateAgendaActionDto } from "../dto/create-agenda-action.dto";
import { Webhook } from "../../webhooks/webhook.entity";
import { AgendaActionsInterface } from "../interface/agenda.actions.interface";
import { google, calendar_v3 } from 'googleapis';

@Injectable()
export class AgendaActionsService {
    constructor(
        @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
        private readonly configService: ConfigService
    ) { }

    async create(user: User, dto: CreateAgendaActionDto): Promise<Action> {
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

        const actionData: AgendaActionsInterface = {
            type: "Agenda",
            title: dto.title
        };

        action.data = JSON.stringify(actionData);
        action.id = await this.actionRepository.insert(action).then((res) => res.identifiers[0].id);
        return action;
    }

    async execute(action: Action): Promise<void> {
        const data: AgendaActionsInterface = JSON.parse(action.data);

        const auth = new google.auth.OAuth2(
            this.configService.get("GOOGLE_CLIENT_ID"),
            this.configService.get("GOOGLE_CLIENT_SECRET"),
        );

        auth.setCredentials({
            access_token: action.application.accessToken,
            refresh_token: action.application.refreshToken
        });

        const calendar = google.calendar({ version: 'v3', auth });
        const config: calendar_v3.Params$Resource$Events$Insert = {
            calendarId: 'primary',
            requestBody: {
                summary: data.title,
                transparency: "transparent",
                start: {
                    dateTime: new Date().toISOString(),
                    timeZone: 'UTC'
                },
                end: {
                    dateTime: new Date().toISOString(),
                    timeZone: 'UTC'
                }
            }
        }
        await calendar.events.insert(config);
    }

    private async getApplication(user: User): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === "Google");

        if (!app) {
            throw new NotFoundException("Google application not found");
        }

        return app;
    }
}
