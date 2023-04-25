import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "../applications/application.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: true, unique: false }) username: string;

    @Column({ nullable: true, unique: true }) email: string;

    @Column({ nullable: true, unique: false }) password: string;

    @OneToMany(() => Application, (application) => application.user) applications: Application[];
}
