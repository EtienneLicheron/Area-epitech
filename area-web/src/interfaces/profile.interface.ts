import { ApplicationInterface } from './application.interface';

export interface ProfileInterface {
    id: number;
    username: string;
    email: string;
    applications: ApplicationInterface[];
}