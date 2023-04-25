import { IsEnum, IsInt, IsString, Max, Min } from "class-validator";
import { TekmeDoorsEnum } from "../interface/tekme.actions.interface";

export class CreateTekmeActionDto {
    @IsEnum(TekmeDoorsEnum, {
        message(args) {
            return `invalid ${args.property}: [${args.constraints[1]}]`;
        }
    })
    door: TekmeDoorsEnum;

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