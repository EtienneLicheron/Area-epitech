import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { AccessService } from "../../access/access.service";
import { ConfigInterface } from "../interfaces/config.interface";
import { StrategyInterface } from "../interfaces/strategy.interface";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    private readonly config: ConfigInterface;

    constructor(private readonly accessService: AccessService, private readonly configService: ConfigService) {
        super();
        this.config = {
            authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
            tokenURL: "https://oauth2.googleapis.com/token",
            profileURL: "https://www.googleapis.com/oauth2/v2/userinfo",
            clientID: this.configService.get("GOOGLE_CLIENT_ID"),
            clientSecret: this.configService.get("GOOGLE_CLIENT_SECRET"),
            callbackURL: this.configService.get("HOST") + ":" + this.configService.get("PORT") + "/auth/google/callback",
            scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://mail.google.com", "https://www.googleapis.com/auth/calendar.events"]
        };
    }

    async validate(req: any): Promise<StrategyInterface> {
        if (req.route.path === "/auth/google") {
            let state = "web";
            if (req.query.device && req.query.device === "mobile" && req.query.token) {
                state = `mobile:${req.query.token}`;
            }
            const url = this.config.authorizationURL + "?scope=" + this.config.scope.join(" ") + "&access_type=offline&include_granted_scopes=true&response_type=code&state=" + state + "&redirect_uri=" + this.config.callbackURL + "&client_id=" + this.config.clientID;
            req.res.redirect(url);
            return null;
        } else if (req.route.path === "/auth/google/callback") {
            if (req.query && req.query.code) {
                const headers = {
                    "Content-Type": "application/x-www-form-urlencoded",
                };

                const data = {
                    code: req.query.code,
                    client_id: this.config.clientID,
                    client_secret: this.config.clientSecret,
                    redirect_uri: this.config.callbackURL,
                    grant_type: "authorization_code",
                }

                const tokens = await this.accessService.request(req.res, "post", this.config.tokenURL, data, headers);
                const profile = await this.accessService.request(req.res, "get", this.config.profileURL, null, { "Authorization": "Bearer " + tokens.access_token });

                const expires: Date = new Date();
                expires.setSeconds(expires.getSeconds() + +tokens.expires_in);

                return {
                    username: profile.name,
                    name: "Google",
                    external: profile.id,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expires: expires,
                    device: req.query.state
                };
            }
        }
        req.res.redirect(this.configService.get("WEB_HOST") + ":" + this.configService.get("WEB_PORT"));
        throw new InternalServerErrorException();
    }
}