import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entity/role.entity";
import { Repository } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}
    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const role = this.roleRepository.create(createRoleDto);
        return await this.roleRepository.save(role);
    }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    async findOne(id: string): Promise<Role | null> {
        return this.roleRepository.findOneBy({ id });
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
        await this.roleRepository.update(id, updateRoleDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.roleRepository.delete(id);
    }
}
