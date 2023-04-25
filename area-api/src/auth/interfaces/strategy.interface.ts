export class StrategyInterface {
    username?: string;
    name?: string;
    external?: string;
    accessToken: string;
    refreshToken?: string;
    expires?: Date;
    device?: string;
}