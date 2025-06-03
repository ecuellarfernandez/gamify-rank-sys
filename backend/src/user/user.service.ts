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
        console.log("[findOneMe] Buscando usuario con id:", id);
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["role"],
        });
        if (!user) {
            console.error("[findOneMe] Usuario no encontrado:", id);
            return null;
        }

        // Busca la última temporada creada (por start_date más reciente)
        const seasonRepo = this.userRepository.manager.getRepository(Season);
        const lastSeason = (
            await seasonRepo.find({
                order: { start_date: "DESC" },
                take: 1,
            })
        )[0];
        console.log("[findOneMe] Última temporada encontrada:", lastSeason);

        let total_points = 0;
        if (lastSeason) {
            const rankingRepo = this.userRepository.manager.getRepository(Ranking);
            const ranking = await rankingRepo.findOne({
                where: { user: { id }, season: { id: lastSeason.id } },
                relations: ["user", "season"],
            });
            console.log("[findOneMe] Ranking encontrado para usuario y temporada:", ranking);
            total_points = ranking?.total_points ?? 0;
        } else {
            console.warn("[findOneMe] No hay temporadas registradas en la base de datos.");
        }

        const result = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            total_points,
        };
        console.log("[findOneMe] Resultado final:", result);
        return result;
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
