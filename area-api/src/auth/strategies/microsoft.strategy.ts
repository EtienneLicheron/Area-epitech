import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { AccessService } from "../../access/access.service";
import { ConfigInterface } from "../interfaces/config.interface";
import { StrategyInterface } from "../interfaces/strategy.interface";

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, "microsoft") {
    private readonly config: ConfigInterface;

    constructor(private readonly accessService: AccessService, private readonly configService: ConfigService) {
        super();
        this.config = {
            authorizationURL: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
            tokenURL: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            profileURL: "https://graph.microsoft.com/v1.0/me",
            clientID: this.configService.get("MICROSOFT_CLIENT_ID"),
            clientSecret: this.configService.get("MICROSOFT_CLIENT_SECRET"),
            callbackURL: this.configService.get("HOST") + ":" + this.configService.get("PORT") + "/auth/microsoft/callback",
            scope: ["User.Read", "User.ReadWrite.All", "Directory.ReadWrite.All", "Tasks.ReadWrite", "Calendars.ReadWrite", "offline_access", "mail.send", "Mail.ReadBasic", "Mail.Read", "User.Read.All", "Contacts.Read", "Files.ReadWrite" ]
        };
    }

    async validate(req: any): Promise<StrategyInterface> {
        if (req.route.path === "/auth/microsoft") {
            const url = this.config.authorizationURL + "?client_id=" + this.config.clientID + "&response_type=code&redirect_uri=" + this.config.callbackURL + "&response_mode=query&scope=" + this.config.scope.join(" ") + "&state=state";
            req.res.redirect(url);
            return null;
        } else if (req.route.path === "/auth/microsoft/callback") {
            if (req.query && req.query.code) {
                const headers = {
                    "Content-Type": "application/x-www-form-urlencoded",
                };

                const data = {
                    client_id: this.config.clientID,
                    code: req.query.code,
                    redirect_uri: this.config.callbackURL,
                    grant_type: "authorization_code",
                    client_secret: this.config.clientSecret
                }

                const tokens = await this.accessService.request(req.res, "post", this.config.tokenURL, data, headers);
                const profile = await this.accessService.request(req.res, "get", this.config.profileURL, {}, { "Authorization": "Bearer " + tokens.access_token });

                const expires: Date = new Date();
                expires.setSeconds(expires.getSeconds() + +tokens.expires_in);

                return {
                    username: profile.displayName,
                    name: "Microsoft",
                    external: profile.id,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expires: expires,
                };
            }
        }
        req.res.redirect(this.configService.get("WEB_HOST") + ":" + this.configService.get("WEB_PORT"));
        throw new InternalServerErrorException();
    }
}