import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Application } from "./applications/application.entity";
import { ApplicationsService } from "./applications/applications.service";
import { User } from "./users/user.entity";
import { UsersService } from "./users/users.service";
import { GithubEventInterface } from "./webhooks/interface/github-event.interface";
import { GoogleEventInterface } from "./webhooks/interface/google.event.interface";
import { MicrosoftEventInterface } from "./webhooks/interface/microsoft.event.interface";
import { Webhook } from "./webhooks/webhook.entity";

@Injectable()
export class AppService {
    private readonly githubEvents: GithubEventInterface[];
    private readonly microsoftEvents: MicrosoftEventInterface[];
    private readonly googleEvents: GoogleEventInterface[];
    constructor(
        private readonly usersService: UsersService,
        private readonly applicationsService: ApplicationsService
    ) {
        this.githubEvents = JSON.parse(require("fs").readFileSync("src/constants/github_events.json", "utf8"));
        this.microsoftEvents = JSON.parse(require("fs").readFileSync("src/constants/microsoft_events.json", "utf8"));
        this.googleEvents = JSON.parse(require("fs").readFileSync("src/constants/google_events.json", "utf8"));
    }

    async getProfile(user: User): Promise<User> {
        user.applications = user.applications.map((application: Application) => {
            application.webhooks.map((webhook: Webhook) => {
                delete webhook.application;
                return webhook;
            });

            delete application.accessToken;
            delete application.refreshToken;
            delete application.expires;
            return application;
        });
        delete user.password;
        return user;
    }

    async updateProfile(user: User, updateUserDto: any): Promise<void> {
        if (updateUserDto.email && (await this.usersService.findOneByEmail(updateUserDto.email))) {
            throw new BadRequestException('Email already exists');
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        if (!(await this.usersService.update(user.id, updateUserDto))) {
            throw new InternalServerErrorException('User not updated');
        }
    }

    async removeProfile(user: User): Promise<void> {
        await this.usersService.remove(user);
    }

    async removeApplication(user: User, name: string): Promise<void> {
        const app: Application = user.applications.find((app: Application) => app.name === name);

        if (!app) {
            throw new BadRequestException(`${name} application not found`);
        }



        if (user.applications.length === 1 && (!user.email || !user.password)) {
            await this.usersService.remove(user);
        } else {
            await this.applicationsService.remove(app);
        }
    }

    async getAbout(req: any): Promise<any> {
        const about = {
            client: {
                // Reverse proxy gives us the IP of the proxy, not the client, that's why we use x-forwarded-for (if available)
                host: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
            },
            server: {
                current_time: new Date().getTime(),
                services: []
            }
        };

        const user = req.user;
        if (user && user.applications) {
            const hueApp = user.applications.find((app: Application) => app.name === 'Hue');
            if (hueApp) {
                const hueService = {
                    name: 'Hue',
                    actions: [],
                    reactions: [{
                        name: 'Update light',
                        description: 'Update a specific light'
                    }]
                };
                about.server.services.push(hueService);
            }

            const twitterApp = user.applications.find((app: Application) => app.name === 'Twitter');
            if (twitterApp) {
                const twitterService = {
                    name: 'Twitter',
                    actions: [],
                    reactions: [{
                        name: 'Send tweet',
                        description: 'Send a tweet'
                    }]
                };
                about.server.services.push(twitterService);
            }

            const tekmeApp = user.applications.find((app: Application) => app.name === 'Tekme');
            if (tekmeApp) {
                const tekmeService = {
                    name: 'Tekme',
                    actions: [],
                    reactions: [{
                        name: "Open door",
                        description: "Open a specific door at Epitech Montpellier"
                    }]
                };
                about.server.services.push(tekmeService);
            }

            const githubApp = user.applications.find((app: Application) => app.name === 'Github');
            if (githubApp) {
                const githubService = {
                    name: 'Github',
                    actions: [],
                    reactions: []
                };
                this.githubEvents.forEach((event: GithubEventInterface) => {
                    githubService.actions.push({
                        name: event.title,
                        description: event.description
                    });
                });
                about.server.services.push(githubService);
            }

            const microsoftApp = user.applications.find((app: Application) => app.name === 'Microsoft');
            if (microsoftApp) {
                const microsoftService = {
                    name: 'Microsoft',
                    actions: [],
                    reactions: [{
                        name: 'Outlook - Send email',
                        description: 'Send an email to a specific email address'
                    }, {
                        name: 'Todo - Create task',
                        description: 'Create a task in your todo list'
                    }, {
                        name: 'Calendar - Create event',
                        description: 'Create an event in your calendar'
                    }]
                };
                this.microsoftEvents.forEach((event: MicrosoftEventInterface) => {
                    microsoftService.actions.push({
                        name: event.service + " - " + event.title,
                        description: event.description
                    });
                });
                about.server.services.push(microsoftService);
            }

            const googleApp = user.applications.find((app: Application) => app.name === 'Google');
            if (googleApp) {
                const googleService = {
                    name: 'Google',
                    actions: [],
                    reactions: [{
                        name: 'Gmail - Send email',
                        description: 'Send an email to a specific email address'
                    }, {
                        name: 'Agenda - Create event',
                        description: 'Create an event in your agenda'
                    }]
                };
                this.googleEvents.forEach((event: GoogleEventInterface) => {
                    googleService.actions.push({
                        name: event.service + " - " + event.title,
                        description: event.description
                    });
                });
                about.server.services.push(googleService);
            }
        }
        return about;
    }
}
