import { IsInt, IsString, Max, Min } from "class-validator";

export class CreateTwitterActionDto {
    @IsString({
        message: "invalid message must be a string"
    })
    message: string;

    @IsInt({
        message: "invalid webhook must be an integer"
    })
    webhook: number;

    @IsInt({
        message: "invalid countdown must be an integer"
    })
    @Min(1, {
        message: "invalid countdown minimum 1"
    })
    @Max(3600, {
        message: "invalid countdown maximum 3600"
    })
    countdown: number;
}