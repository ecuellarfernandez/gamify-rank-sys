/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString } from "class-validator";

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name?: string;
}
