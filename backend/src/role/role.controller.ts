import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { RoleService } from "./role.service";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { CreateRoleDto } from "./dto/create-role.dto";

@Controller("role")
export class RoleController {
    constructor(private readonly roleService: RoleService) {}
    @Get()
    findAll() {
        return this.roleService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.roleService.findOne(Number(id));
    }

    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Put(":id")
    update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(Number(id), updateRoleDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.roleService.remove(Number(id));
    }
}
