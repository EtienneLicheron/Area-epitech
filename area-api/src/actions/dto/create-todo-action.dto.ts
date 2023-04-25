import { IsInt, IsString, Max, Min } from "class-validator";

export class CreateTodoActionDto {
    @IsString({
        message: "invalid task must be a string"
    })
    task: string;

    @IsString({
        message: "invalid external must be a string"
    })
    external: string;

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
