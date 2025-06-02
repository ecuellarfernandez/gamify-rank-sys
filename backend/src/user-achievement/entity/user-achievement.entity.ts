import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Achievement } from "src/achievement/entity/achievement.entity";

@Entity()
export class UserAchievement {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Achievement)
    @JoinColumn({ name: "achievement_id" })
    achievement: Achievement;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    date: Date;
}
