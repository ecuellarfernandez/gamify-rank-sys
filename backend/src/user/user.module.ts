import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "src/role/entity/role.entity";
import { User } from "./entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
