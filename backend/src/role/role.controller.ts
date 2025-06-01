import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { RoleService } from "./role.service";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guard/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";

@Controller("role")
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @UseGuards(AuthGuard("jwt"))
    @Get()
    findAll() {
        return this.roleService.findAll();
    }

    @UseGuards(AuthGuard("jwt"))
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.roleService.findOne(id);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Put(":id")
    update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(id, updateRoleDto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.roleService.remove(Number(id));
    }
}
