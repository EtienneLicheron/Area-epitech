import { IsEnum, IsInt, IsString, Max, Min } from "class-validator";
import { HueActionsEnum, HueTypesEnum } from "../interface/hue.actions.interface";

export class CreateHueActionDto {
    @IsEnum(HueTypesEnum, {
        message(args) {
            return `invalid ${args.property}: [${args.constraints[1]}]`;
        }
    })
    type: HueTypesEnum;

    @IsEnum(HueActionsEnum, {
        message(args) {
            return `invalid ${args.property}: [${args.constraints[1]}]`;
        }
    })
    action: HueActionsEnum;

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