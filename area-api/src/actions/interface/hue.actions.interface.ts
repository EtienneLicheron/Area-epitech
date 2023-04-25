export enum HueTypesEnum {
    "light" = "light",
    "scene" = "scene",
}

export enum HueActionsEnum {
    "on" = "on",
    "off" = "off",
}

export interface HueActionsInterface {
    type: HueTypesEnum;
    action: HueActionsEnum;
    external: string;
}
