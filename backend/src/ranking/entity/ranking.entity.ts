import { Season } from "src/season/entity/season.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ranking {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.rankings)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Season, (season) => season.rankings)
    @JoinColumn()
    season: Season;

    @Column()
    total_points: number;
}
