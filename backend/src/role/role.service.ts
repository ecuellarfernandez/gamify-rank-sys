import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entity/role.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}
    async create(roleData: Partial<Role>): Promise<Role> {
        const role = this.roleRepository.create(roleData);
        return this.roleRepository.save(role);
    }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    async findOne(id: number): Promise<Role | null> {
        return this.roleRepository.findOneBy({ id });
    }

    async update(id: number, updateData: Partial<Role>): Promise<Role | null> {
        await this.roleRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.roleRepository.delete(id);
    }
}
