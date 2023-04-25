import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigInterface } from "../interfaces/config.interface";
import { ConfigService } from "@nestjs/config";
import { StrategyInterface } from "../interfaces/strategy.interface";
import { AccessService } from "../../access/access.service";

@Injectable()
export class HueStrategy extends PassportStrategy(Strategy, "hue") {

    private readonly config: ConfigInterface;

    constructor(private readonly accessService: AccessService, private readonly configService: ConfigService) {
        super();
        this.config = {
            authorizationURL: "https://api.meethue.com/v2/oauth2/authorize",
            tokenURL: "https://api.meethue.com/v2/oauth2/token",
            clientID: this.configService.get("HUE_CLIENT_ID"),
            clientSecret: this.configService.get("HUE_CLIENT_SECRET"),
            callbackURL: this.configService.get("HOST") + ":" + this.configService.get("PORT") + "/auth/hue/callback"
        };
    }

    async validate(req: any): Promise<StrategyInterface> {
        if (req.route.path === "/auth/hue") {
            const url = this.config.authorizationURL + "?client_id=" + this.config.clientID + "&redirect_uri=" + this.config.callbackURL + "&response_type=code";
            req.res.redirect(url);
            return null;
        } else if (req.route.path === "/auth/hue/callback") {
            if (req.query && req.query.code) {
                const data = {
                    grant_type: "authorization_code",
                    code: req.query.code,
                    client_id: this.config.clientID,
                    client_secret: this.config.clientSecret
                };
                const tokens = await this.accessService.request(req.res, "post", this.config.tokenURL, data, { "Content-Type": "application/x-www-form-urlencoded" });

                const headers = {
                    "Authorization": "Bearer " + tokens.access_token,
                    "Content-Type": "application/json"
                };

                await this.accessService.request(req.res, "put", "https://api.meethue.com/route/api/0/config", { "linkbutton": true }, headers);
                const profile = await this.accessService.request(req.res, "post", "https://api.meethue.com/route/api", { "devicetype": "Area" }, headers);

                const expires: Date = new Date();
                expires.setSeconds(expires.getSeconds() + +tokens.expires_in);

                return {
                    username: null,
                    name: "Hue",
                    external: profile[0].success.username,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expires
                };
            }
        }
        req.res.redirect(this.configService.get("WEB_HOST") + ":" + this.configService.get("WEB_PORT"));
        throw new InternalServerErrorException("test");
    }
}