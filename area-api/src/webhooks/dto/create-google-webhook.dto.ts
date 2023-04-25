import { IsString } from "class-validator";

export class CreateGoogleWebhookDto {
    @IsString({
        message: 'invalid service'
    }) service: string;

    @IsString({
        message: 'invalid event'
    }) event: string;
}
