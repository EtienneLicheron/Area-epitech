import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "../applications/application.entity";
import { Action } from "../actions/action.entity";

@Entity()
export class Webhook {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: false, unique: false }) external: string;

    @Column({ nullable: false, unique: false }) event: string;

    @Column({ nullable: true, unique: false }) argument: string;

    @ManyToOne(() => Application, (application) => application.webhooks) application: Application;

    @OneToMany(() => Action, (action) => action.webhook) actions: Action[];
}
