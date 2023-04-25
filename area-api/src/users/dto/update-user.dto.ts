import { IsEmail, IsOptional, IsString, IsStrongPassword, Length } from "class-validator";

export class UpdateUserDto {
    @IsString({
        message: "invalid username"
    }) @Length(3, 16, {
        message(validationArguments) {
            return `invalid ${validationArguments.property} length: ${validationArguments.constraints[0]} - ${validationArguments.constraints[1]}`;
        }, groups: ["username"]
    }) @IsOptional()
    username?: string;

    @IsEmail({}, {
        message: "invalid email"
    }) @Length(5, 255, {
        message(validationArguments) {
            return `invalid ${validationArguments.property} length: ${validationArguments.constraints[0]} - ${validationArguments.constraints[1]}`;
        }
    }) @IsOptional()
    email?: string;

    @IsStrongPassword({
        minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    }, {
        message: "invalid password"
    }) @Length(8, 32, {
        message(validationArguments) {
            return `invalid ${validationArguments.property} length: ${validationArguments.constraints[0]} - ${validationArguments.constraints[1]}`;
        }
    }) @IsOptional()
    password?: string;
}
