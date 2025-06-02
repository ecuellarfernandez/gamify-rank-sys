import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Activity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    type: string;

    @Column()
    description: string;

    @Column()
    points: number;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    date: Date;
}
