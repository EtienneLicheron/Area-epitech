import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { Application } from "../applications/application.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(Application) private readonly applicationRepository: Repository<Application>,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {
    }

    async getApplicationByID(id: number): Promise<Application> {
        return this.applicationRepository.findOne({ where: [{ id }] });
    }

    async request(response: any, method: string, url: string, data: any, headers: any): Promise<any> {
        const res = await firstValueFrom(this.httpService
            .request({
                method,
                url,
                data,
                headers
            })
            .pipe(catchError((err) => {
                console.log("Error: (request)", method, url, err.response);
                if (response) {
                    response.redirect(this.configService.get("WEB_HOST") + ":" + this.configService.get("WEB_PORT"));
                }
                throw new InternalServerErrorException();
            })
            ));
        return res.data;
    }

    async refresh(app: Application): Promise<Application> {
        if (!app.expires || (app.expires.getTime() - (new Date()).getTime()) / (1000 * 60) > 5) {
            return app;
        }

        switch (app.name) {
            case "Hue":
                return await this.refreshHue(app);
            case "Twitter":
                return await this.refreshTwitter(app);
            case "Microsoft":
                return await this.refreshMicrosoft(app);
            case "Google":
                return await this.refreshGoogle(app);
        }

        throw new InternalServerErrorException();
    }

    private async refreshHue(app: Application): Promise<Application> {
        const tokens_req = {
            url: "https://api.meethue.com/v2/oauth2/token",
            method: "POST",
            data: {
                "grant_type": "refresh_token",
                "refresh_token": app.refreshToken
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(this.configService.get("HUE_CLIENT_ID") + ":" + this.configService.get("HUE_CLIENT_SECRET")).toString("base64")
            }
        }

        const tokens = await this.request(null, tokens_req.method, tokens_req.url, tokens_req.data, tokens_req.headers);

        const headers = {
            "Authorization": "Bearer " + tokens.access_token,
            "Content-Type": "application/json"
        };

        await this.request(null, "put", "https://api.meethue.com/route/api/0/config", { "linkbutton": true }, headers);
        const profile = await this.request(null, "post", "https://api.meethue.com/route/api", { "devicetype": "Area" }, headers);

        app.external = profile[0].success.username;
        return this.updateApplication(app, tokens);
    }

    private async refreshTwitter(app: Application): Promise<Application> {
        const tokens_req = {
            url: "https://api.twitter.com/2/oauth2/token",
            method: "POST",
            data: {
                "grant_type": "refresh_token",
                "refresh_token": app.refreshToken
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(this.configService.get("TWITTER_CLIENT_ID") + ":" + this.configService.get("TWITTER_CLIENT_SECRET")).toString("base64")
            }
        };

        const tokens = await this.request(null, tokens_req.method, tokens_req.url, tokens_req.data, tokens_req.headers);

        return this.updateApplication(app, tokens);
    }

    private async refreshMicrosoft(app: Application): Promise<Application> {
        const tokens_req = {
            url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            method: "POST",
            data: {
                "client_id": this.configService.get("MICROSOFT_CLIENT_ID"),
                "refresh_token": app.refreshToken,
                "grant_type": "refresh_token",
                "client_secret": this.configService.get("MICROSOFT_CLIENT_SECRET")
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"

            }
        };

        const tokens = await this.request(null, tokens_req.method, tokens_req.url, tokens_req.data, tokens_req.headers);

        return this.updateApplication(app, tokens);
    }

    private async refreshGoogle(app: Application): Promise<Application> {
        const tokens_req = {
            url: "https://oauth2.googleapis.com/token",
            method: "POST",
            data: {
                "client_id": this.configService.get("GOOGLE_CLIENT_ID"),
                "client_secret": this.configService.get("GOOGLE_CLIENT_SECRET"),
                "grant_type": "refresh_token",
                "refresh_token": app.refreshToken
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        const tokens = await this.request(null, tokens_req.method, tokens_req.url, tokens_req.data, tokens_req.headers);

        return this.updateApplication(app, tokens);
    }

    private async updateApplication(app: Application, tokens: any): Promise<Application> {
        const expires: Date = new Date();
        expires.setSeconds(expires.getSeconds() + +tokens.expires_in);

        app.accessToken = tokens.access_token;
        app.refreshToken = tokens.refresh_token;
        app.expires = expires;

        await this.applicationRepository.save(app);

        return app;
    }
}
