import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { catchError, firstValueFrom } from "rxjs";
import { Application } from "../../applications/application.entity";
import { User } from "../../users/user.entity";
import { Webhook } from "../../webhooks/webhook.entity";
import { Repository } from "typeorm";
import { Action } from "../action.entity";
import { CreateTekmeActionDto } from "../dto/create-tekme-action.dto";
import { TekmeDoorsEnum } from "../interface/tekme.actions.interface";

@Injectable()
export class TekmeActionsService {
    constructor(
        @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
        private readonly httpService: HttpService
    ) { }

    async getDoors(user: User): Promise<[object[], number]> {
        const app: Application = await this.getApplication(user);
        const doors = Object.keys(TekmeDoorsEnum).map((key) => TekmeDoorsEnum[key]);

        return [doors, doors.length];
    }

    async create(user: User, dto: CreateTekmeActionDto): Promise<Action> {
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

        action.data = dto.door;

        action.id = await this.actionRepository.insert(action).then((res) => res.identifiers[0].id);

        return action;
    }

    async execute(action: Action): Promise<void> {
        await firstValueFrom(this.httpService
            .get(`https://epilogue.arykow.com/api/doors_open?token=${action.application.accessToken}&door_name=${action.data}`)
            .pipe(catchError(() => {
                throw new InternalServerErrorException();
            }))
        );
    }

    private async getApplication(user: User): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === "Tekme");

        if (!app) {
            throw new NotFoundException("Tekme application not found");
        }

        return app;
    }
}