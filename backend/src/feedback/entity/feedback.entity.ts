import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Feedback {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "transmitter_id" })
    transmitter: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "receiver_id" })
    receiver: User;

    @Column()
    message: string;

    @Column()
    points: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
