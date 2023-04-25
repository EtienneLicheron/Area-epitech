import { IsEmail, IsInt, IsString, Max, Min } from "class-validator";

export class CreateAgendaActionDto {
    @IsString({
        message: "invalid title must be a string"
    })
    title: string;

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
