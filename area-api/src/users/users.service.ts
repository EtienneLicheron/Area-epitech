import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApplicationsService } from "../applications/applications.service";
import { StrategyInterface } from "../auth/interfaces/strategy.interface";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly applicationsService: ApplicationsService
    ) {
    }

    async create(createUserDto: CreateUserDto | StrategyInterface): Promise<User> {
        const user = new User();

        user.username = createUserDto.username;
        if (!(createUserDto instanceof StrategyInterface)) {
            user.email = createUserDto.email == "" ? null : createUserDto.email;
            user.password = createUserDto.password;
        }
        user.id = await this.userRepository.insert(user).then(res => res.identifiers[0].id);

        return user;
    }

    async findAll(): Promise<[User[], number]> {
        return this.userRepository.findAndCount();
    }

    async findOneById(id: number): Promise<User> {
        return this.userRepository.findOne({
            where: [{ id }], relations: ["applications", "applications.webhooks", "applications.webhooks.actions", "applications.actions", "applications.webhooks.application"]
        });
    }

    async findOneByUsername(username: string): Promise<User> {
        return this.userRepository.findOne({ where: [{ username }] });
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: [{ email }] });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: [{ id }] });

        if (!user) {
            return null;
        }

        user.username = !!updateUserDto.username ? updateUserDto.username : user.username;
        user.email = !!updateUserDto.email ? updateUserDto.email : user.email;
        user.password = !!updateUserDto.password ? updateUserDto.password : user.password;

        return this.userRepository.save(user);
    }

    async remove(user: User): Promise<void> {
        await this.applicationsService.removeByUser(user);
        delete user.applications;
        await this.userRepository.remove(user);
    }
}
