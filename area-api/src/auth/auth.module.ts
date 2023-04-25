import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt/dist";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { ApplicationsModule } from "../applications/applications.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GithubStrategy } from "./strategies/github.strategy";
import { HttpModule } from "@nestjs/axios";
import { HueStrategy } from "./strategies/hue.strategy";
import { TwitterStrategy } from "./strategies/twitter.strategy";
import { AccessModule } from "../access/access.module";
import { MicrosoftStrategy } from "./strategies/microsoft.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
    imports: [ConfigModule, AccessModule, UsersModule, ApplicationsModule, PassportModule, JwtModule.registerAsync({
        imports: [ConfigModule], useFactory: async (configService: ConfigService) => ({
            secret: configService.get("JWT_SECRET"), signOptions: {
                expiresIn: configService.get("JWT_EXPIRATION")
            }
        }), inject: [ConfigService]
    }), HttpModule.registerAsync({
        imports: [ConfigModule], useFactory: async (configService: ConfigService) => ({
            timeout: configService.get("HTTP_TIMEOUT"), maxRedirects: configService.get("HTTP_MAX_REDIRECTS")
        }), inject: [ConfigService]
    })],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, GithubStrategy, HueStrategy, TwitterStrategy, MicrosoftStrategy, GoogleStrategy],
    exports: [AuthService]
})
export class AuthModule {
}
