import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/role/entity/role.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest<{ user?: { role?: Role } }>();
        const user = request.user;
        return this.hasRole(user, requiredRoles);
    }

    private hasRole(user: { role?: Role } | undefined, requiredRoles: string[]): boolean {
        console.log("Checking user role:", user?.role?.name, "against required roles:", requiredRoles);
        if (!user || !user.role || !user.role.name) {
            return false;
        }
        return requiredRoles.includes(user.role.name);
    }
}
