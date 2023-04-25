import { IsString } from "class-validator";

export class CreateGithubWebhookDto {
    @IsString({
        message: 'invalid repository'
    })
    repository: string;

    @IsString({
        message: 'invalid event'
    })
    event: string;
}
