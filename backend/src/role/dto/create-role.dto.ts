/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
