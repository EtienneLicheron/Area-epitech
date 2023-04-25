import { ActionInterface } from './action.interface'

export interface WebhookInterface {
    id: number;
    external: string;
    event: string;
    argument: string;
    actions: ActionInterface[];
}