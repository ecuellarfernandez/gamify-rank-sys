import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { AuthUser } from "./type/auth-user.type";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(pass, user.password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException("Invalid credentials");
    }

    async validateUserWithRole(email: string, pass: string): Promise<AuthUser> {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ["role"],
        });
        if (user && (await bcrypt.compare(pass, user.password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            console.log("User validated with role:", result.role.name);
            return result;
        }
        throw new UnauthorizedException("Invalid credentials");
    }

    login(user: AuthUser) {
        const payload = { email: user.email, sub: user.id, role: user.role.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role.name,
            },
        };
    }
}
