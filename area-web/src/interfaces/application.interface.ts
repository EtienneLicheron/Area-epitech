import { WebhookInterface } from './webhook.interface';
import { ActionInterface } from './action.interface';

export interface ApplicationInterface {
    external: string;
    id: number;
    name: string;
    webhooks: WebhookInterface[];
    actions: ActionInterface[];
}