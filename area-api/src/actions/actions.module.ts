import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Action } from "./action.entity";
import { HueActionsController } from "./hue/hue.actions.controller";
import { HueActionsService } from "./hue/hue.actions.service";
import { ActionsService } from "./actions.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AccessModule } from "../access/access.module";
import { TwitterActionsService } from "./twitter/twitter.actions.service";
import { TwitterActionsController } from "./twitter/twitter.actions.controller";
import { ActionsController } from "./actions.controller";
import { TekmeActionsController } from "./tekme/tekme.actions.controller";
import { TekmeActionsService } from "./tekme/tekme.actions.service";
import { GmailActionsController } from "./gmail/gmail.actions.controller";
import { GmailActionsService } from "./gmail/gmail.actions.service";
import { OutlookActionsController } from "./outlook/outlook.actions.controller";
import { OutlookActionsService } from "./outlook/outlook.actions.service";
import { TodoActionsController } from "./todo/todo.actions.controller";
import { TodoActionsService } from "./todo/todo.actions.service";
import { CalendarActionsController } from "./calendar/calendar.actions.controller";
import { CalendarActionsService } from "./calendar/calendar.actions.service";
import { AgendaActionsController } from "./agenda/agenda.actions.controller";
import { AgendaActionsService } from "./agenda/agenda.actions.service";

@Module({
    imports: [ConfigModule, AccessModule, TypeOrmModule.forFeature([Action]), HttpModule.registerAsync({
        imports: [ConfigModule], useFactory: async (configService: ConfigService) => ({
            timeout: configService.get("HTTP_TIMEOUT"), maxRedirects: configService.get("HTTP_MAX_REDIRECTS")
        }), inject: [ConfigService]
    })],
    controllers: [ActionsController, HueActionsController, TwitterActionsController, TekmeActionsController, GmailActionsController, OutlookActionsController, TodoActionsController, CalendarActionsController, AgendaActionsController],
    providers: [ActionsService, HueActionsService, TwitterActionsService, TekmeActionsService, GmailActionsService, OutlookActionsService, TodoActionsService, CalendarActionsService, AgendaActionsService],
    exports: [ActionsService]
})

export class ActionsModule {
}