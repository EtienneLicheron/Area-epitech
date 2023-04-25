import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { ConfigService } from "@nestjs/config";
import { ConfigInterface } from "../interfaces/config.interface";
import { StrategyInterface } from "../interfaces/strategy.interface";
import { AccessService } from "../../access/access.service";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {

    private readonly config: ConfigInterface;

    constructor(private readonly accessService: AccessService, private readonly configService: ConfigService) {
        super();
        this.config = {
            authorizationURL: "https://github.com/login/oauth/authorize",
            tokenURL: "https://github.com/login/oauth/access_token",
            profileURL: "https://api.github.com/user",
            clientID: this.configService.get("GITHUB_CLIENT_ID"),
            clientSecret: this.configService.get("GITHUB_CLIENT_SECRET"),
            callbackURL: this.configService.get("HOST") + ":" + this.configService.get("PORT") + "/auth/github/callback",
            scope: ["repo"]
        };
    }

    async validate(req: any): Promise<StrategyInterface> {
        if (req.route.path === "/auth/github") {
            const url = this.config.authorizationURL + "?client_id=" + this.config.clientID + "&redirect_uri=" + this.config.callbackURL + "&scope=" + this.config.scope.join(" ");
            req.res.redirect(url);
            return null;
        } else if (req.route.path === "/auth/github/callback") {
            if (req.query && req.query.code) {
                const url = this.config.tokenURL + "?client_id=" + this.config.clientID + "&client_secret=" + this.config.clientSecret + "&code=" + req.query.code;
                const tokens = await this.accessService.request(req.res, "post", url, {}, { "Accept": "application/json" });
                const profile = await this.accessService.request(req.res, "get", this.config.profileURL, {}, { "Authorization": "token " + tokens.access_token });

                return {
                    username: profile.name,
                    name: "Github",
                    external: profile.id,
                    accessToken: tokens.access_token,
                    refreshToken: null,
                    expires: null
                };
            }
        }
        req.res.redirect(this.configService.get("WEB_HOST") + ":" + this.configService.get("WEB_PORT"));
        throw new InternalServerErrorException();
    }
}