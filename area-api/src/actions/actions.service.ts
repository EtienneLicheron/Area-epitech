import { Injectable, NotFoundException } from "@nestjs/common";
import { Action } from "./action.entity";
import { HueActionsService } from "./hue/hue.actions.service";
import { AccessService } from "../access/access.service";
import { TwitterActionsService } from "./twitter/twitter.actions.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { TekmeActionsService } from "./tekme/tekme.actions.service";
import { GmailActionsService } from "./gmail/gmail.actions.service";
import { AgendaActionsService } from "./agenda/agenda.actions.service";
import { OutlookActionsService } from "./outlook/outlook.actions.service";
import { TodoActionsService } from "./todo/todo.actions.service";
import { CalendarActionsService } from "./calendar/calendar.actions.service";

@Injectable()
export class ActionsService {
    constructor(
        @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
        private readonly hueActionsService: HueActionsService,
        private readonly twitterActionsService: TwitterActionsService,
        private readonly tekmeActionsService: TekmeActionsService,
        private readonly gmailActionsService: GmailActionsService,
        private readonly agendaActionsService: AgendaActionsService,
        private readonly outlookActionsService: OutlookActionsService,
        private readonly todoActionsService: TodoActionsService,
        private readonly calendarActionsService: CalendarActionsService,
        private readonly accessService: AccessService
    ) {
    }

    async execute(action: Action): Promise<void> {
        action.application = await this.accessService.refresh(await this.accessService.getApplicationByID(action.application.id));

        switch (action.application.name) {
            case "Hue":
                return await this.hueActionsService.execute(action);
            case "Twitter":
                return await this.twitterActionsService.execute(action);
            case "Tekme":
                return await this.tekmeActionsService.execute(action);
            case "Google":
                return await this.googleActionsService(action);
            case "Microsoft":
                return await this.microsoftActionsService(action);
        }
    }

    private async googleActionsService(action: Action): Promise<void> {
        const { type } = JSON.parse(action.data);

        switch (type) {
            case "Gmail":
                return await this.gmailActionsService.execute(action);
            case "Agenda":
                return await this.agendaActionsService.execute(action);
        }
    }

    private async microsoftActionsService(action: Action): Promise<void> {
        const { type } = JSON.parse(action.data);

        switch (type) {
            case "Outlook":
                return await this.outlookActionsService.execute(action);
            case "Todo":
                return await this.todoActionsService.execute(action);
            case "Calendar":
                return await this.calendarActionsService.execute(action);
        }
    }

    async removeById(id: number): Promise<void> {
        const action = await this.actionRepository.findOneBy({ id });

        if (!!action) {
            await this.actionRepository.remove(action);
        }
    }

    async remove(user: User, id: number): Promise<void> {
        const action: Action = user.applications.map((a) => a.actions).flat().find((a) => a.id === id);

        if (!action) {
            throw new NotFoundException('Action not found');
        }

        await this.actionRepository.remove(action);
    }
}