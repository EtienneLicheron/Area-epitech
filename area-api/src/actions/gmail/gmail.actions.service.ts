import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Application } from "../../applications/application.entity";
import { User } from "../../users/user.entity";
import { Repository } from "typeorm";
import { Action } from "../action.entity";
import { ConfigService } from "@nestjs/config";
import { CreateEmailActionDto } from "../dto/create-email-action.dto";
import { Webhook } from "../../webhooks/webhook.entity";
import { EmailActionsInterface } from "../interface/email.actions.interface";
import { google } from 'googleapis';

@Injectable()
export class GmailActionsService {
    constructor(
        @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
        private readonly configService: ConfigService
    ) { }

    async create(user: User, dto: CreateEmailActionDto): Promise<Action> {
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

        const actionData: EmailActionsInterface = {
            type: "Gmail",
            destination: dto.destination,
            subject: dto.subject,
            message: dto.message
        };

        action.data = JSON.stringify(actionData);

        action.id = await this.actionRepository.insert(action).then((res) => res.identifiers[0].id);

        return action;
    }

    async execute(action: Action): Promise<void> {
        const data: EmailActionsInterface = JSON.parse(action.data);

        const auth = new google.auth.OAuth2(
            this.configService.get("GOOGLE_CLIENT_ID"),
            this.configService.get("GOOGLE_CLIENT_SECRET"),
        );

        auth.setCredentials({
            access_token: action.application.accessToken,
            refresh_token: action.application.refreshToken
        });

        google.gmail({ version: 'v1', auth }).users.messages.send({
            userId: 'me',
            requestBody: {
                raw: Buffer.from(`From: me\r\nTo: ${data.destination}\r\nSubject: ${data.subject}\r\n\r\n${data.message}`).toString('base64')
            }
        }, (err, res) => { });
    }

    private async getApplication(user: User): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === "Google");

        if (!app) {
            throw new NotFoundException("Google application not found");
        }

        return app;
    }
}
