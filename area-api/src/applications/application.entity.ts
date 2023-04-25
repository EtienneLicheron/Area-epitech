import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Webhook } from "../webhooks/webhook.entity";
import { Action } from "../actions/action.entity";

@Entity()
export class Application {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: false, unique: false, enum: ["Github", "Hue", "Twitter", "Microsoft", "Tekme", "Google"] }) name: string;

    @Column({ nullable: true, unique: false }) external: string;

    @Column({ nullable: false, unique: false }) accessToken: string;

    @Column({ nullable: true, unique: false }) refreshToken: string;

    @Column({ nullable: true, unique: false }) expires: Date;

    @ManyToOne(() => User, (user) => user.applications) user: User;

    @OneToMany(() => Webhook, (webhook) => webhook.application) webhooks: Webhook[];

    @OneToMany(() => Action, (action) => action.application) actions: Action[];
}
