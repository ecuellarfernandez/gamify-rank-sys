import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guard/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { AuthenticatedRequest } from "./type/authenticated-request.type";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard("jwt"))
    @Get("me")
    async me(@Req() req: AuthenticatedRequest) {
        return await this.userService.findOne(String(req.user.id));
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.userService.findOne(id);
    }

    @Post("register")
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Put(":id")
    async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(id, updateUserDto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.userService.remove(id);
    }
}
