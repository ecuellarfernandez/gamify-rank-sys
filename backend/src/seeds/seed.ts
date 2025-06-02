/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { Role } from "../role/entity/role.entity";
import { User } from "../user/entity/user.entity";
import { Activity } from "../activity/entity/activity.entity";
import { Season } from "../season/entity/season.entity";
import { Ranking } from "../ranking/entity/ranking.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const roleRepo = app.get("RoleRepository") as Repository<Role>;
    const userRepo = app.get("UserRepository") as Repository<User>;
    const activityRepo = app.get("ActivityRepository") as Repository<Activity>;
    const seasonRepo = app.get("SeasonRepository") as Repository<Season>;
    const rankingRepo = app.get("RankingRepository") as Repository<Ranking>;

    // 1. Roles
    const roles = ["admin", "user"];
    for (const name of roles) {
        const exists = await roleRepo.findOne({ where: { name } });
        if (!exists) await roleRepo.save(roleRepo.create({ name }));
    }

    // 2. Usuarios
    const adminRole = await roleRepo.findOne({ where: { name: "admin" } });
    const userRole = await roleRepo.findOne({ where: { name: "user" } });

    if (!adminRole || !userRole) {
        throw new Error("Roles 'admin' and 'user' must exist in the database.");
    }

    const usersData = [
        { name: "Admin", email: "admin@email.com", password: "adminpassword", role: adminRole },
        { name: "Alice", email: "alice@email.com", password: "password123", role: userRole },
        { name: "Bob", email: "bob@email.com", password: "password123", role: userRole },
        { name: "Charlie", email: "charlie@email.com", password: "password123", role: userRole },
        { name: "Diana", email: "diana@email.com", password: "password123", role: userRole },
        { name: "Eve", email: "eve@email.com", password: "password123", role: userRole },
    ];

    const users: User[] = [];
    for (const data of usersData) {
        let user = await userRepo.findOne({ where: { email: data.email } });
        if (!user) {
            const password = await bcrypt.hash(data.password, 10);
            user = userRepo.create({ ...data, password });
            await userRepo.save(user);
        }
        users.push(user);
    }

    // 3. Actividades
    const activitiesData = [
        { type: "Quiz", description: "Complete the weekly quiz", points: 50 },
        { type: "Project", description: "Submit a project", points: 100 },
        { type: "Attendance", description: "Attend all sessions this week", points: 30 },
        { type: "Bonus", description: "Extra challenge", points: 70 },
    ];
    const activities: Activity[] = [];
    for (const data of activitiesData) {
        let activity = await activityRepo.findOne({ where: { description: data.description } });
        if (!activity) {
            activity = activityRepo.create(data);
            await activityRepo.save(activity);
        }
        activities.push(activity);
    }

    // 4. Más temporadas
    const now = new Date();
    const seasonsData = [
        {
            name: "Spring 2024",
            start_date: new Date(now.getFullYear() - 1, 2, 1), // Mar 1, 2024
            end_date: new Date(now.getFullYear() - 1, 4, 31), // May 31, 2024
        },
        {
            name: "Summer 2024",
            start_date: new Date(now.getFullYear() - 1, 5, 1), // Jun 1, 2024
            end_date: new Date(now.getFullYear() - 1, 7, 31), // Aug 31, 2024
        },
        {
            name: "Autumn 2024",
            start_date: new Date(now.getFullYear() - 1, 8, 1), // Sep 1, 2024
            end_date: new Date(now.getFullYear() - 1, 10, 30), // Nov 30, 2024
        },
        {
            name: "Winter 2024",
            start_date: new Date(now.getFullYear() - 1, 11, 1), // Dec 1, 2024
            end_date: new Date(now.getFullYear(), 1, 28), // Feb 28, 2025
        },
        {
            name: "Spring 2025",
            start_date: new Date(now.getFullYear(), 2, 1), // Mar 1, 2025
            end_date: new Date(now.getFullYear(), 4, 31), // May 31, 2025
        },
        {
            name: "Summer 2025",
            start_date: new Date(now.getFullYear(), 5, 1), // Jun 1, 2025
            end_date: new Date(now.getFullYear(), 7, 31), // Aug 31, 2025
        },
    ];
    const seasons: Season[] = [];
    for (const data of seasonsData) {
        let season = await seasonRepo.findOne({ where: { name: data.name } });
        if (!season) {
            season = seasonRepo.create(data);
            await seasonRepo.save(season);
        }
        seasons.push(season);
    }

    // 5. Rankings para todas las temporadas
    for (const [seasonIdx, season] of seasons.entries()) {
        for (const [userIdx, user] of users.entries()) {
            // Genera puntos distintos para cada usuario y temporada
            const total_points = 100 + seasonIdx * 30 + userIdx * 40 + Math.floor(Math.random() * 30);
            let ranking = await rankingRepo.findOne({ where: { user: { id: user.id }, season: { id: season.id } } });
            if (!ranking) {
                ranking = rankingRepo.create({
                    user,
                    season,
                    total_points,
                });
                await rankingRepo.save(ranking);
            }
        }
    }

    await app.close();
    console.log("Seed completed!");
}

bootstrap().catch((err) => {
    console.error("Error during seeding:", err);
    process.exit(1);
});
