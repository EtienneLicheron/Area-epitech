import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { ApplicationsService } from "../applications/applications.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { StrategyInterface } from "./interfaces/strategy.interface";
import { Response } from "express";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly applicationsService: ApplicationsService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
    }

    //
    // Validate
    //

    async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            return user;
        }
        return null;
    }

    async validateToken(access_token: string): Promise<any> {
        try {
            return this.jwtService.verify(access_token, {
                secret: this.configService.get("JWT_SECRET")
            });
        } catch (error) {
            return null;
        }
    }

    //
    // Local
    //

    async login(res: Response, id: number): Promise<string> {
        const access_token = this.jwtService.sign({ id });
        res.cookie("access_token", access_token);
        return access_token;
    }

    async register(res: Response, createUserDto: CreateUserDto): Promise<void> {
        if (await this.usersService.findOneByEmail(createUserDto.email)) {
            throw new BadRequestException("Email already exists");
        }

        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

        const user = await this.usersService.create(createUserDto);

        if (!user) {
            throw new InternalServerErrorException("User not created");
        }

        await this.login(res, user.id);
    }

    //
    // Application
    //

    async applicationLogin(res: Response, name: string, strategyData: StrategyInterface, access_token: string): Promise<void> {
        let user: User;
        let device: string = "web";
        let token: string = access_token;

        if (strategyData.device && strategyData.device.startsWith("mobile:")) {
            device = "mobile";
            token = strategyData.device.substring(7);
        }

        if (!!token) {
            const verify = await this.validateToken(token);

            if (!!verify && !!verify.id) {
                user = await this.usersService.findOneById(verify.id);

                const check = await this.applicationsService.findUserByNameAndExternal(strategyData.name, strategyData.external);

                if (!!check && check.id !== user.id) {
                    this.redirect(device, "", res);
                    throw new BadRequestException("Application already linked to another user");
                }
            }
        } else {
            user = await this.applicationsService.findUserByNameAndExternal(strategyData.name, strategyData.external);
        }

        if (!user) {
            user = await this.usersService.create(strategyData);
        }

        if (!user) {
            this.redirect(device, "", res);
            throw new InternalServerErrorException("User not created");
        }

        if (!user.username && !!strategyData.username) {
            await this.usersService.update(user.id, { username: strategyData.username });
        }

        if (!!user.applications && user.applications.length > 0) {
            const app = user.applications.find(app => app.name === name);

            if (!!app) {
                await this.applicationsService.update(app.id, strategyData);
                this.redirect(device, await this.login(res, user.id), res);
                return;
            }
        }
        const app = await this.applicationsService.create(user, strategyData);

        if (!app) {
            this.redirect(device, "", res);
            throw new InternalServerErrorException("Application not created");
        }

        this.redirect(device, await this.login(res, user.id), res);
    }

    private redirect(device: string, token: string, res: Response): void {
        if (device === "mobile") {
            res.redirect(`${this.configService.get('MOBILE_HOST')}token=${token}`)
        } else {
            res.redirect(this.configService.get('WEB_HOST') + ":" + this.configService.get('WEB_PORT'));
        }
    }
}
