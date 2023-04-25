import { Client } from "@microsoft/microsoft-graph-client";
import { HttpService } from "@nestjs/axios"
import { Injectable, InternalServerErrorException, NotFoundException, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import { catchError, firstValueFrom } from "rxjs"
import { Application } from "../../applications/application.entity"
import { User } from "../../users/user.entity"
import { Repository } from "typeorm"
import { CreateMicrosoftWebhookDto } from "../dto/create-microsoft-webhook.dto"
import { MicrosoftEventInterface } from "../interface/microsoft.event.interface"
import { Webhook } from "../webhook.entity"
import { AccessService } from "../../access/access.service"
import { ActionsService } from "../../actions/actions.service"
import { Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class MicrosoftWebhooksService {
    private readonly events: MicrosoftEventInterface[]

    constructor(
        @InjectRepository(Webhook) private readonly webhookRepository: Repository<Webhook>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly accessService: AccessService,
        private readonly actionsService: ActionsService
    ) {
        this.events = JSON.parse(require("fs").readFileSync("src/constants/microsoft_events.json", "utf8"))
    }

    async getServices(): Promise<Object[]> {
        const services = [...new Set(this.events.map(event => event.service))]
        return services.map(service => {
            return {
                "title": service,
                "events": this.events.filter(event => event.service === service).map(event => event.title)
            }
        })
    }

    async create(user: User, dto: CreateMicrosoftWebhookDto): Promise<Webhook> {
        const app: Application = await this.getApplication(user)
        const event: MicrosoftEventInterface = this.events.find(event => event.title === dto.event)
        if (!event) {
            throw new NotFoundException("Event not found")
        }
        const webhook: Webhook = new Webhook()
        const expirationDateTime: Date = new Date()
        expirationDateTime.setHours(expirationDateTime.getHours() + 1)
        const client = Client.init({
            authProvider: (done: any) => {
                done(null, app.accessToken)
            }
        });

        if (dto.service === "To-Do") { // Nous devons aller chercher l'id de la liste de tâches par défaut
            const data = await client.api("/me/todo/lists").get()
            const defaultList = data.value.find((list: any) => list.isOwner && list.wellknownListName === "defaultList")
            if (!defaultList) {
                throw new NotFoundException("Default To-Do list not found, go to https://to-do.office.com to create one")
            }
            event.resource = event.resource.replace("{listId}", defaultList.id)
        }

        const data = await client.api("/subscriptions").post({
            "changeType": event.actions.join(","),
            "notificationUrl": `${this.configService.get("HOST")}:${this.configService.get("PORT")}/webhooks/payload/microsoft`,
            "resource": event.resource,
            "expirationDateTime": expirationDateTime.toISOString()
        })
        webhook.external = data.id
        webhook.event = dto.event
        webhook.argument = dto.service
        webhook.application = app
        webhook.id = await this.webhookRepository.insert(webhook).then((res: any) => res.identifiers[0].id)
        return webhook
    }

    private async getApplication(user: User): Promise<Application> {
        const app: Application = user.applications.find((app: Application) => app.name === 'Microsoft')

        if (!app) {
            throw new NotFoundException("Microsoft application not found")
        }
        return await this.accessService.refresh(app)
    }

    async removeByApplication(application: Application): Promise<void> {
        for (const webhook of application.webhooks) {
            await this.remove(webhook)
        }
    }

    async remove(webhook: Webhook): Promise<void> {
        const client = Client.init({
            authProvider: (done: any) => {
                done(null, webhook.application.accessToken)
            }
        });

        await client.api(`/subscriptions/${webhook.external}`).delete().catch(catchError(() => {
            throw new InternalServerErrorException()
        }))

        for (const action of webhook.actions) {
            await this.actionsService.removeById(action.id)
        }
        await this.webhookRepository.remove(webhook)
    }

    @Timeout(5000) // couldn't find a way to make it work with two decorators, so I had to do it like this
    async subscribtionLifecycleOnStart(): Promise<void> {
        return await this.subscribtionLifecycle()
    }

    @Interval(900000)
    async subscribtionLifecycle(): Promise<void> {
        const logger = new Logger("MicrosoftWebhooksService")
        const webhooks: Webhook[] = await this.webhookRepository.find({ where: { application: { name: "Microsoft" } }, relations: ["application", "application.user", "application.user.applications"] })
        if (webhooks.length === 0)
            return

        logger.log("Lifecycle: starting...")
        for (const webhook of webhooks) {
            // logger.log("Lifecycle: checking webhook with id " + webhook.id)
            const app: Application = await this.getApplication(webhook.application.user)
            const client = Client.init({
                authProvider: (done: any) => {
                    done(null, app.accessToken)
                }
            });
            let baseData = null
            try {
                baseData = await client.api(`/subscriptions/${webhook.external}`).get()
            }
            catch (e) {
                // logger.log("Lifecycle: webhook with id " + webhook.id + " not found on Microsoft, recreating...")
            }
            const expirationDateTime: Date = new Date()
            expirationDateTime.setHours(expirationDateTime.getHours() + 1)

            if (!baseData || (baseData && new Date(baseData.expirationDateTime) < new Date())) {
                const event = this.events.find(event => event.title === webhook.event)
                if (!event) {
                    // logger.log("Lifecycle: event does not exist anymore, deleting webhook with id " + webhook.id)
                    await this.remove(webhook)
                    return
                }
                const data = await client.api("/subscriptions").post({
                    "changeType": event.actions.join(","),
                    "notificationUrl": `${this.configService.get("HOST")}:${this.configService.get("PORT")}/webhooks/payload/microsoft`,
                    "resource": event.resource,
                    "expirationDateTime": expirationDateTime.toISOString()
                })
                webhook.external = data.id
                await this.webhookRepository.save(webhook)
                logger.log("Lifecycle: webhook with id " + webhook.id + " re-created" + (baseData ? " (old one expired)" : " (old one not found, probably expired)"))
            }

            else {
                await client.api(`/subscriptions/${webhook.external}`).patch({
                    "expirationDateTime": expirationDateTime.toISOString()
                })
                logger.log("Lifecycle: webhook with id " + webhook.id + " patched")
            }
        }
        logger.log("Lifecycle: finished")
    }
}