import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Action } from "../action.entity";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { User } from "../../users/user.entity";
import { catchError, firstValueFrom } from "rxjs";
import { Application } from "../../applications/application.entity";
import { CreateHueActionDto } from "../dto/create-hue-action.dto";
import { HueActionsInterface } from "../interface/hue.actions.interface";
import { Webhook } from "../../webhooks/webhook.entity";
import { AccessService } from "../../access/access.service";

@Injectable()
export class HueActionsService {
    constructor(
        @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
        private readonly httpService: HttpService,
        private readonly accessService: AccessService,
    ) { }

    async getLights(user: User): Promise<[object[], number]> {
        const app: Application = await this.getApplication(user);

        const { data } = await firstValueFrom(this.httpService
            .get("https://api.meethue.com/route/clip/v2/resource/device", {
                headers: {
                    "Authorization": `Bearer ${app.accessToken}`,
                    "hue-application-key": app.external
                }
            }).pipe(catchError(() => {
                throw new InternalServerErrorException();
            }))
        );

        const lights = data["data"].map((light) => {
            const external = light["services"].find((elem) => elem.rtype === "light");
            if (!external) return null;
            return {
                name: light["metadata"]["name"],
                external: external["rid"]
            };
        }).filter((elem) => elem !== null);

        return [lights, lights.length];
    }

    async getLightByExternal(user: User, external: string): Promise<object> {
        const lights = await this.getLights(user);
        const light = lights[0].find((elem: any) => elem.external === external);

        if (!light) {
            throw new NotFoundException("Light not found");
        }

        return light;
    }

    async getScenes(user: User): Promise<[object[], number]> {
        const app: Application = await this.getApplication(user);

        const { data } = await firstValueFrom(this.httpService
            .get("https://api.meethue.com/route/clip/v2/resource/scene", {
                headers: {
                    "Authorization": `Bearer ${app.accessToken}`,
                    "hue-application-key": app.external
                }
            }).pipe(catchError(() => {
                throw new InternalServerErrorException();
            }))
        );

        const scenes = data["data"].map((scene) => {
            return {
                name: scene["metadata"]["name"],
                external: scene["group"]["rid"]
            };
        });

        return [scenes, scenes.length];
    }

    async getSceneByExternal(user: User, external: string): Promise<object> {
        const scenes = await this.getScenes(user);
        const scene = scenes[0].find((elem: any) => elem.external === external);

        if (!scene) {
            throw new NotFoundException("Scene not found");
        }

        return scene;
    }


    async create(user: User, dto: CreateHueActionDto): Promise<Action> {
        const app: Application = await this.getApplication(user);
        const webhook: Webhook = user.applications.map((app) => app.webhooks).flat().find((webhook) => webhook.id === dto.webhook);
        let externals;

        if (!webhook) {
            throw new NotFoundException("Webhook not found");
        }

        if (dto.type === "light") {
            externals = (await this.getLights(user))[0];
        }

        if (dto.type === "scene") {
            externals = (await this.getScenes(user))[0];
        }

        if (!externals || !externals.find((elem) => elem.external === dto.external)) {
            throw new NotFoundException(`Hue ${dto.type} not found`);
        }

        const action = new Action();

        action.application = app;
        action.webhook = webhook;
        action.countdown = dto.countdown;
        action.position = webhook.actions.length;

        const actionData: HueActionsInterface = {
            type: dto.type,
            action: dto.action,
            external: dto.external
        };

        action.data = JSON.stringify(actionData);

        action.id = await this.actionRepository.insert(action).then((res) => res.identifiers[0].id);

        return action;
    }

    async execute(action: Action): Promise<void> {
        const data: HueActionsInterface = JSON.parse(action.data);

        await firstValueFrom(this.httpService
            .put(`https://api.meethue.com/route/clip/v2/resource/${data.type}/${data.external}`, {
                "on": {
                    "on": data.action === "on"
                }
            }, {
                headers: {
                    "Authorization": `Bearer ${action.application.accessToken}`,
                    "hue-application-key": action.application.external
                }
            })).catch(() => { });
    }

    private async getApplication(user: User): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === "Hue");

        if (!app) {
            throw new NotFoundException("Hue application not found");
        }

        return this.accessService.refresh(app);
    }
}