import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Application } from "../../applications/application.entity";
import { User } from "../../users/user.entity";
import { Repository } from "typeorm";
import { Action } from "../action.entity";
import { Webhook } from "../../webhooks/webhook.entity";
import { EmailActionsInterface } from "../interface/email.actions.interface";
import { Client } from '@microsoft/microsoft-graph-client';
import { google } from 'googleapis';
import { CreateEmailActionDto } from "../dto/create-email-action.dto";

@Injectable()
export class OutlookActionsService {
    constructor(
        @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
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
            type: "Outlook",
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

        const client = Client.init({
            authProvider: (done: any) => {
                done(null, action.application.accessToken);
            }
        });

        const message = {
            subject: data.subject,
            body: {
                content: data.message,
                contentType: 'text'
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: data.destination
                    }
                }
            ]
        };

        await client.api('/me/sendMail').post({ message });
    }

    private async getApplication(user: User): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === "Microsoft");

        if (!app) {
            throw new NotFoundException("Microsoft application not found");
        }

        return app;
    }
}
