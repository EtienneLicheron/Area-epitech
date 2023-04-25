import { Client } from "@microsoft/microsoft-graph-client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { AccessService } from "../../access/access.service";
import { Application } from "../../applications/application.entity";
import { User } from "../../users/user.entity";
import { Webhook } from "../../webhooks/webhook.entity";
import { Repository } from "typeorm";
import { Action } from "../action.entity";
import { CreateTodoActionDto } from "../dto/create-todo-action.dto";
import { TodoActionsInterface } from "../interface/todo.actions.interface";

@Injectable()
export class TodoActionsService {
    constructor(
        @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
        private readonly configService: ConfigService,
        private readonly accessService: AccessService
    ) { }

    async getLists(user: User): Promise<[object[], number]> {
        const app: Application = await this.getApplication(user);

        const client = Client.init({
            authProvider: (done: any) => {
                done(null, app.accessToken);
            }
        });

        const data = (await client.api('/me/todo/lists').get()).value;

        const lists = data.map((list) => {
            return {
                name: list.displayName,
                external: list.id
            };
        });

        return [lists, lists.length];
    }

    async create(user: User, dto: CreateTodoActionDto): Promise<Action> {
        const app: Application = await this.getApplication(user);
        const webhook: Webhook = user.applications.map((app) => app.webhooks).flat().find((webhook) => webhook.id === dto.webhook);

        if (!webhook) {
            throw new NotFoundException("Webhook not found");
        }

        const externals = (await this.getLists(user))[0].map((list: any) => list.external);

        if (!externals.includes(dto.external)) {
            throw new NotFoundException("Todo list not found");
        }

        const action = new Action();

        action.application = app;
        action.webhook = webhook;
        action.countdown = dto.countdown;
        action.position = webhook.actions.length;

        const actionData: TodoActionsInterface = {
            type: "Todo",
            external: dto.external,
            task: dto.task
        };

        action.data = JSON.stringify(actionData);

        action.id = await this.actionRepository.insert(action).then((res) => res.identifiers[0].id);

        return action;
    }

    async execute(action: Action): Promise<void> {
        const data: TodoActionsInterface = JSON.parse(action.data);

        const client = Client.init({
            authProvider: (done: any) => {
                done(null, action.application.accessToken);
            }
        });

        const task = {
            "title": data.task,
            "linkedResources": [
                {
                    "webUrl": `${this.configService.get("WEB_HOST")}:${this.configService.get("WEB_PORT")}`,
                    "applicationName": "Area",
                    "displayName": "Area"
                }
            ]
        };

        const tasks = await client.api(`/me/todo/lists/${data.external}/tasks`).post(task);
    }

    private async getApplication(user: User): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === "Microsoft");

        if (!app) {
            throw new NotFoundException("Microsoft application not found");
        }

        return this.accessService.refresh(app);;
    }
}
