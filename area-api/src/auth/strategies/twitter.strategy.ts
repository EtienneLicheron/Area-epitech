import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { ConfigService } from "@nestjs/config";
import { ConfigInterface } from "../interfaces/config.interface";
import { StrategyInterface } from "../interfaces/strategy.interface";
import { AccessService } from "../../access/access.service";

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, "twitter") {

    private readonly config: ConfigInterface;

    constructor(private readonly accessService: AccessService, private readonly configService: ConfigService) {
        super();
        this.config = {
            authorizationURL: "https://twitter.com/i/oauth2/authorize",
            tokenURL: "https://api.twitter.com/2/oauth2/token",
            profileURL: "https://api.twitter.com/2/users/me",
            clientID: this.configService.get("TWITTER_CLIENT_ID"),
            clientSecret: this.configService.get("TWITTER_CLIENT_SECRET"),
            callbackURL: this.configService.get("HOST") + ":" + this.configService.get("PORT") + "/auth/twitter/callback",
            scope: ["tweet.read", "tweet.write", "users.read", "offline.access"]
        };
    }

    async validate(req: any): Promise<StrategyInterface> {
        if (req.route.path === "/auth/twitter") {
            const url = this.config.authorizationURL + "?response_type=code&client_id=" + this.config.clientID + "&redirect_uri=" + this.config.callbackURL + "&scope=" + this.config.scope.join(" ") + "&state=state&code_challenge=challenge&code_challenge_method=plain";
            req.res.redirect(url);
            return null;
        } else if (req.route.path === "/auth/twitter/callback") {
            if (req.query && req.query.code) {
                const headers = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + Buffer.from(this.config.clientID + ":" + this.config.clientSecret).toString("base64")
                };

                const data = {
                    code: req.query.code,
                    grant_type: "authorization_code",
                    client_id: this.config.clientID,
                    redirect_uri: this.config.callbackURL,
                    code_verifier: "challenge"
                };

                const tokens = await this.accessService.request(req.res, "post", this.config.tokenURL, data, headers);
                const profile = await this.accessService.request(req.res, "get", this.config.profileURL, {}, { "Authorization": "Bearer " + tokens.access_token });

                const expires: Date = new Date();
                expires.setSeconds(expires.getSeconds() + +tokens.expires_in);

                return {
                    username: profile.data.name,
                    name: "Twitter",
                    external: profile.data.id,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expires
                };
            }
        }
        req.res.redirect(this.configService.get("WEB_HOST") + ":" + this.configService.get("WEB_PORT"));
        throw new InternalServerErrorException();
    }
}