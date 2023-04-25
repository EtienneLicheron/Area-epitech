import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationsModule } from "../applications/applications.module";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Module({
    imports: [ApplicationsModule, TypeOrmModule.forFeature([User])], providers: [UsersService], exports: [UsersService]
})
export class UsersModule {
}
