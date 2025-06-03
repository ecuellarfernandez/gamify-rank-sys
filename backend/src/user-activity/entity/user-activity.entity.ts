import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Activity } from "src/activity/entity/activity.entity";
import { Season } from "src/season/entity/season.entity";

@Entity()
export class UserActivity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Activity, { nullable: false })
    @JoinColumn({ name: "activity_id" })
    activity: Activity;

    @ManyToOne(() => Season, { nullable: false })
    @JoinColumn({ name: "season_id" })
    season: Season;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    completedAt: Date;
}
