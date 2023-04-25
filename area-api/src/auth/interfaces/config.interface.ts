export interface ConfigInterface {
    authorizationURL: string;
    tokenURL: string;
    profileURL?: string;
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
}