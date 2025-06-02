/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsInt, Min } from "class-validator";

export class CreateActivityDto {
    @IsString()
    type: string;

    @IsString()
    description: string;

    @IsInt()
    @Min(0)
    points: number;
}
