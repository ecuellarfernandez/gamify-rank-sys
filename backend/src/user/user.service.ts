import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Role } from "src/role/entity/role.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { UserMeType } from "./type/user-me.type";
import { Season } from "src/season/entity/season.entity";
import { Ranking } from "src/ranking/entity/ranking.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

            // Busca el rol "user"
            const role = await this.roleRepository.findOne({ where: { name: "user" } });
            if (!role) throw new NotFoundException('Default role "user" not found');

            const user = this.userRepository.create({
                ...createUserDto,
                password: hashedPassword,
                role,
            });
            return await this.userRepository.save(user);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error.code === "23505") {
                throw new ConflictException("Email already registered.");
            }
            throw new InternalServerErrorException("Error creating user.");
        }
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({ relations: ["role"] });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email }, relations: ["role"] });
    }

    async findOneMe(id: string): Promise<UserMeType | null> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["role"],
        });
        if (!user) return null;

        // Busca la temporada actual
        const seasonRepo = this.userRepository.manager.getRepository(Season);
        const now = new Date();
        const currentSeason = await seasonRepo
            .createQueryBuilder("season")
            .where("season.start_date <= :now", { now })
            .andWhere("season.end_date >= :now", { now })
            .orderBy("season.start_date", "DESC")
            .getOne();

        let total_points = 0;
        if (currentSeason) {
            const rankingRepo = this.userRepository.manager.getRepository(Ranking);
            const ranking = await rankingRepo.findOne({
                where: { user: { id }, season: { id: currentSeason.id } },
            });
            total_points = ranking?.total_points ?? 0;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            total_points,
        };
    }

    async findOne(id: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ["role"] });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async update(id: string, updateData: Partial<User>): Promise<User | null> {
        await this.userRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
