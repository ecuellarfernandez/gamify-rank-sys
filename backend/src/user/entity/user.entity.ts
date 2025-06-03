import { Role } from "src/role/entity/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsString, MinLength } from "class-validator";
import { Ranking } from "src/ranking/entity/ranking.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

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

    @OneToMany(() => Ranking, (ranking) => ranking.user)
    rankings: Ranking[];
}
