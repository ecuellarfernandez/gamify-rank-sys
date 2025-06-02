import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";
import { AuthModule } from "./auth/auth.module";
import { ActivityModule } from "./activity/activity.module";
import { AchievementModule } from "./achievement/achievement.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { SeasonModule } from "./season/season.module";
import { RankingModule } from "./ranking/ranking.module";
import { UserActivityModule } from "./user-activity/user-activity.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: true,
            logging: true,
        }),
        UserModule,
        RoleModule,
        AuthModule,
        ActivityModule,
        AchievementModule,
        FeedbackModule,
        SeasonModule,
        RankingModule,
        UserActivityModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
