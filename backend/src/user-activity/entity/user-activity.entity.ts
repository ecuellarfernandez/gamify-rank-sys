import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Activity } from "src/activity/entity/activity.entity";

@Entity()
export class UserActivity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Activity)
    @JoinColumn({ name: "activity_id" })
    activity: Activity;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    completedAt: Date;
}
