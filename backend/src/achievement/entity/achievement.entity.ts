import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Achievement {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    points: number;

    @Column()
    criteria: string;
}
