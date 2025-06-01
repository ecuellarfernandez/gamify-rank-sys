import { User } from "src/user/entity/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({ unique: true })
    name: string;
    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
