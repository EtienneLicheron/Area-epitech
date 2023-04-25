import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService, private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), JwtStrategy.extractJWT]),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_SECRET"),
            signOptions: { expiresIn: configService.get("JWT_EXPIRATION") }
        });
    }

    private static extractJWT(req: any): string | null {
        if (req.cookies && "access_token" in req.cookies && req.cookies.access_token.length > 0) {
            return req.cookies.access_token;
        }
        return null;
    }

    async validate(payload: any) {
        const user = await this.usersService.findOneById(payload.id);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        return user;
    }
}
