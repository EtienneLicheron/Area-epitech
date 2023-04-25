import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { UpdateUserDto } from "./users/dto/update-user.dto";
import { AppService } from "./app.service";
import { User } from "./users/user.entity";

@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    async getProfile(@Req() req: any): Promise<User> {
        return this.appService.getProfile(req.user);
    }

    @Put()
    async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto): Promise<void> {
        await this.appService.updateProfile(req.user, updateUserDto);
    }

    @Delete()
    async removeProfile(@Req() req: any): Promise<void> {
        await this.appService.removeProfile(req.user);
    }

    @Delete("application/:name")
    async removeApplication(@Req() req: any, @Param("name") name: string): Promise<void> {
        await this.appService.removeApplication(req.user, name);
    }

    @Get("about.json")
    async getAbout(@Req() req: any): Promise<any> {
        return this.appService.getAbout(req);
    }
}
