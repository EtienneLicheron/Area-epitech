import { IsString } from "class-validator";

export class CreateMicrosoftWebhookDto {
    @IsString({
        message: 'invalid service'
    }) service: string;

    @IsString({
        message: 'invalid event'
    }) event: string;
}
