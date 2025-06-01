import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Get()
    findAll() {
        return this.UserService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.UserService.findOne(Number(id));
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.UserService.create(createUserDto);
    }

    @Put(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.UserService.update(Number(id), updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.UserService.remove(Number(id));
    }
}
