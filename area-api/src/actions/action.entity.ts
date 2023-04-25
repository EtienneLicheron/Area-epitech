import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Webhook } from "../webhooks/webhook.entity";
import { Application } from "../applications/application.entity";

@Entity()
export class Action {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: false, unique: false }) data: string;

    @Column({ nullable: false, unique: false }) countdown: number;

    @Column({ nullable: false, unique: false }) position: number;

    @ManyToOne(() => Webhook, (webhook) => webhook.actions) webhook: Webhook;

    @ManyToOne(() => Application, (application) => application.actions) application: Application;
}