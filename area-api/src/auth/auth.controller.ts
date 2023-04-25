import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { GitHubAuthGuard } from "./guards/github-auth.guard";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { Request, Response } from "express";
import { HueAuthGuard } from "./guards/hue-auth.guard";
import { StrategyInterface } from "./interfaces/strategy.interface";
import { TwitterAuthGuard } from "./guards/twitter-auth.guard";
import { MicrosoftAuthGuard } from "./guards/microsoft-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { GoogleAuthGuard } from "./guards/google-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        ) {
    }

    //
    // Local
    //

    @UseGuards(LocalAuthGuard) @Post("login")
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
        const localStrategyData: any = req.user;
        await this.authService.login(res, localStrategyData.id);
    }

    @Post("register")
    async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<void> {
        await this.authService.register(res, createUserDto);
    }

    //
    // GitHub
    //

    @Get("github") @UseGuards(GitHubAuthGuard)
    async githubAuth(@Req() req: Request): Promise<void> {
    }

    @Get("github/callback") @UseGuards(GitHubAuthGuard)
    async githubAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
        await this.authService.applicationLogin(res, "Github", <StrategyInterface>req.user, await this.getToken(req));
    }

    //
    // Hue
    //

    @Get("hue")
    @UseGuards(JwtAuthGuard, HueAuthGuard)
    async hueAuth(@Req() req: Request): Promise<void> {
    }

    @Get("hue/callback")
    @UseGuards(JwtAuthGuard, HueAuthGuard)
    async hueAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
        await this.authService.applicationLogin(res, "Hue", <StrategyInterface>req.user, await this.getToken(req));
    }

    //
    // Twitter
    //

    @Get("twitter") @UseGuards(TwitterAuthGuard)
    async twitterAuth(@Req() req: Request): Promise<void> {
    }

    @Get("twitter/callback") @UseGuards(TwitterAuthGuard)
    async twitterAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
        await this.authService.applicationLogin(res, "Twitter", <StrategyInterface>req.user, await this.getToken(req));
    }

    //
    // Microsoft
    //

    @Get("microsoft") @UseGuards(MicrosoftAuthGuard)
    async microsoftAuth(@Req() req: Request): Promise<void> {
    }

    @Get("microsoft/callback") @UseGuards(MicrosoftAuthGuard)
    async microsoftAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
        await this.authService.applicationLogin(res, "Microsoft", <StrategyInterface>req.user, await this.getToken(req));
    }

    //
    // Google
    //

    @Get("google") @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req: Request): Promise<void> {
    }

    @Get("google/callback") @UseGuards(GoogleAuthGuard)
    async googleAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
        await this.authService.applicationLogin(res, "Google", <StrategyInterface>req.user, await this.getToken(req));
    }

    //
    // Private
    //

    private async getToken(req: Request): Promise<string> {
        if (req["headers"]["authorization"] && req["headers"]["authorization"].startsWith("Bearer "))
            return req["headers"]["authorization"].substring(7);
        else if (req.cookies && req.cookies.access_token)
            return req.cookies.access_token;
        else
            return null;
    }
}
