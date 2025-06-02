import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Season {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ type: "date" })
    start_date: Date;

    @Column({ type: "date" })
    end_date: Date;
}
