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
    constructor(private readonly UserService: UserService) {}

    @UseGuards(AuthGuard("jwt"))
    @Get("me")
    me(@Req() req: AuthenticatedRequest) {
        return this.UserService.findOne(Number(req.user.id));
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Get()
    findAll() {
        return this.UserService.findAll();
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.UserService.findOne(Number(id));
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.UserService.create(createUserDto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Put(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.UserService.update(Number(id), updateUserDto);
    }

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.UserService.remove(Number(id));
    }
}
