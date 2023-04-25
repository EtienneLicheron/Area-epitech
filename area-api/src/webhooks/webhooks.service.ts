import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Webhook } from "./webhook.entity";
import { Application } from "../applications/application.entity";
import { GithubWebhooksService } from "./github/github.webhooks.service";
import { MicrosoftWebhooksService } from "./microsoft/microsoft.webhooks.service";
import { User } from "../users/user.entity";

@Injectable()
export class WebhooksService {
    constructor(
        @InjectRepository(Webhook) private readonly webhookRepository: Repository<Webhook>,
        private readonly githubWebhooksService: GithubWebhooksService,
        private readonly microsoftWebhooksService: MicrosoftWebhooksService,
    ) {
    }

    async findAllByExternal(external: string): Promise<Webhook[]> {
        return this.webhookRepository.find({
            where: [{ external }],
            relations: ["application", "actions", "actions.application"]
        });
    }

    async findAllByArgumentAndName(argument: string, name: string): Promise<Webhook[]> {
        return this.webhookRepository.find({
            where: [{ argument , application: { name }}],
            relations: ["application", "actions", "actions.application"]
        });
    }

    async removeByApplication(application: Application): Promise<void> {
        switch (application.name) {
            case "Github":
                return await this.githubWebhooksService.removeByApplication(application);
            case "Microsoft":
                return await this.microsoftWebhooksService.removeByApplication(application);
        }
    }

    async remove(user: User, id: number): Promise<void> {
        const webhook: Webhook = user.applications.map((a) => a.webhooks).flat().find((a) => a.id === id);

        if (!webhook) {
            throw new NotFoundException('Webhook not found');
        }

        switch (webhook.application.name) {
            case "Github":
                return await this.githubWebhooksService.remove(webhook);
            case "Microsoft":
                return await this.microsoftWebhooksService.remove(webhook);
        }
    }
}
