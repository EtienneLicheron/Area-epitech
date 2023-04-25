import { Injectable, NotFoundException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { WebhooksService } from "../webhooks.service";
import { Webhook } from "../webhook.entity";
import { ActionsService } from "../../actions/actions.service";
import { google } from "googleapis"
import { Application } from "../../applications/application.entity";
import { AccessService } from "../../access/access.service";

@Injectable()
export class PayloadWebhooksService {
    constructor(
        private readonly httpService: HttpService,
        private readonly webhooksService: WebhooksService,
        private readonly actionsService: ActionsService,
        private readonly accessService: AccessService
    ) {
    }

    async githubPayload(headers: any): Promise<void> {
        const webhook: Webhook = (await this.webhooksService.findAllByExternal(headers["x-github-hook-id"])).find((webhook) => webhook.application.name === "Github");

        if (!webhook) {
            throw new NotFoundException("Github webhook not found");
        }

        if (headers["x-github-event"] === "ping") {
            return;
        }

        if (headers["x-github-event"] !== webhook.event) {
            throw new NotFoundException("Github webhook event not found");
        }

        webhook.actions = webhook.actions.sort((a, b) => a.position - b.position);
        for (let i = 0; i < webhook.actions.length; i++) {
            await new Promise(f => setTimeout(f, webhook.actions[i].countdown * 1000));
            await this.actionsService.execute(webhook.actions[i]);
        }
    }

    async microsoftPayload(req: any, validationToken: string): Promise<void> {
        if (validationToken) {
            req.res.send(validationToken);
        }
        if (validationToken && validationToken.includes("Validation: Testing client application"))
            return
        const data = req.body.value[0]
        const webhooks = (await this.webhooksService.findAllByExternal(data.subscriptionId));
        if (webhooks.length === 0) {
            throw new NotFoundException("Microsoft webhook not found");
        }
        webhooks.forEach(async (webhook) => {
            for (let i = 0; i < webhook.actions.length; i++) {
                await new Promise(f => setTimeout(f, webhook.actions[i].countdown * 1000));
                await this.actionsService.execute(webhook.actions[i]);
            }
        })
        return
    }
}
