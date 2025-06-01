/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Role } from "src/role/entity/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsString, MinLength } from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    password: string;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: "role_id" })
    role: Role;
}
