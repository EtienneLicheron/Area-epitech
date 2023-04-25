import { IsString } from "class-validator";

export class CreateApplicationDto {
    @IsString({
        message: "invalid token must be a string"
    })
    token: string;
}
