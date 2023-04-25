import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Application } from "./application.entity";
import { WebhooksService } from "../webhooks/webhooks.service";
import { User } from "../users/user.entity";
import { StrategyInterface } from "../auth/interfaces/strategy.interface";
import { ActionsService } from "../actions/actions.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Application) private readonly applicationRepository: Repository<Application>,
        private readonly webhooksService: WebhooksService,
        private readonly actionsService: ActionsService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
    }

    async findUserByNameAndExternal(name: string, external: string): Promise<User> {
        const app = await this.applicationRepository.findOne({
            where: [{ name, external }],
            relations: ["user", "user.applications"]
        })

        if (!app) {
            return null;
        }
        return app.user;
    }

    async create(user: User, app: any): Promise<Application> {
        const application = new Application();

        application.user = user;
        application.name = app.name;
        application.external = app.external;
        application.accessToken = app.accessToken;
        application.refreshToken = app.refreshToken;
        application.expires = app.expires;
        application.id = await this.applicationRepository.insert(application).then(res => res.identifiers[0].id);

        return application;
    }

    async createWithToken(user: User, name: any, token: string): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === name);

        if (app) {
            return this.update(app.id, { accessToken: token });
        } else {
            return this.create(user, { name, accessToken: token });
        }
    }

    async update(id: number, strategyData: StrategyInterface): Promise<Application> {
        const app = await this.applicationRepository.findOne({
            where: [{ id }]
        });

        if (!app) {
            return null;
        }

        app.external = !!strategyData.external ? strategyData.external : app.external;
        app.accessToken = !!strategyData.accessToken ? strategyData.accessToken : app.accessToken;
        app.refreshToken = !!strategyData.refreshToken ? strategyData.refreshToken : app.refreshToken;
        app.expires = !!strategyData.expires ? strategyData.expires : app.expires;

        return this.applicationRepository.save(app);
    }

    async removeByUser(user: User): Promise<void> {
        for (const application of user.applications)
            await this.remove(application);
    }

    async remove(app: Application): Promise<void> {
        for (const actions of app.actions) {
            await this.actionsService.removeById(actions.id);
        }
        await this.webhooksService.removeByApplication(app);
        delete app.actions;
        delete app.webhooks;

        switch (app.name) {
            case "Github":
                await this.removeGithub(app);
                break;
            case "Twitter":
                await this.removeTwitter(app);
                break;
            case "Microsoft":
                await this.removeMicrosoft(app);
                break;
            case "Google":
                await this.removeGoogle(app);
                break;
        }

        await this.applicationRepository.remove(app);
    }

    private async removeGithub(app: Application): Promise<void> {
        const req = {
            url: `https://api.github.com/applications/${this.configService.get("GITHUB_CLIENT_ID")}/grant`,
            method: "DELETE",
            data: {
                access_token: app.accessToken
            },
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": "Basic " + Buffer.from(this.configService.get("GITHUB_CLIENT_ID") + ":" + this.configService.get("GITHUB_CLIENT_SECRET")).toString("base64")
            }
        }

        await this.request(req.url, req.method, req.data, req.headers);
    }

    private async removeTwitter(app: Application): Promise<void> {
        const req = {
            url: "https://api.twitter.com/2/oauth2/revoke?token_type_hint=refresh_token",
            method: "POST",
            data: {
                token: app.refreshToken,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(this.configService.get("TWITTER_CLIENT_ID") + ":" + this.configService.get("TWITTER_CLIENT_SECRET")).toString("base64")
            }
        }

        await this.request(req.url, req.method, req.data, req.headers);
    }

    private async removeMicrosoft(app: Application): Promise<void> {
        // const req = {
        //     url: "https://graph.microsoft.com/v1.0/me/revokeSignInSessions",
        //     method: "POST",
        //     headers: {
        //         "Authorization": "Bearer " + app.accessToken,
        //         "Content-Type": "application/json"
        //     }
        // }

        // await this.request(req.url, req.method, {}, req.headers);
    }

    private async removeGoogle(app: Application): Promise<void> {
        const req = {
            url: `https://oauth2.googleapis.com/revoke?token=${app.refreshToken}`,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        await this.request(req.url, req.method, {}, req.headers);
    }

    private async request(url: string, method: string, data: any, headers: any): Promise<void> {
        await firstValueFrom(this.httpService
            .request({
                method: method,
                url: url,
                data: data,
                headers: headers
            })
        ).catch(() => { }
        );
    }
}
