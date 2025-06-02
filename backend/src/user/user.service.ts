import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Role } from "src/role/entity/role.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";

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

    async findOne(id: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id },
            relations: ["role"],
        });
    }

    async update(id: string, updateData: Partial<User>): Promise<User | null> {
        await this.userRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
