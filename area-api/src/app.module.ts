import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { User } from "./users/user.entity";
import { Application } from "./applications/application.entity";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ApplicationsModule } from "./applications/applications.module";
import { WebhooksModule } from "./webhooks/webhooks.module";
import { Webhook } from "./webhooks/webhook.entity";
import { AppService } from "./app.service";
import { Action } from "./actions/action.entity";
import { ActionsModule } from "./actions/actions.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(), TypeOrmModule.forRootAsync({
        imports: [ConfigModule], useFactory: (configService: ConfigService) => ({
            type: "postgres",
            host: configService.get("DB_HOST"),
            port: +configService.get("DB_PORT"),
            username: configService.get("DB_USERNAME"),
            password: configService.get("DB_PASSWORD"),
            database: configService.get("DB_DATABASE"),
            entities: [User, Application, Webhook, Action],
            synchronize: configService.get("DB_SYNC") === "true"
        }), inject: [ConfigService]
    }), UsersModule, AuthModule, ApplicationsModule, WebhooksModule, ActionsModule, ScheduleModule.forRoot()],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
}
