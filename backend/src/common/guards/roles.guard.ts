import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../users/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Extrai as roles definidas no decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se a rota não tiver o decorator @Roles, o acesso é liberado (público ou apenas autenticado)
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 2. Verifica se o usuário existe (Garantia de que o JwtAuthGuard rodou antes)
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado no request');
    }

    // 3. Verifica se o usuário possui a role necessária
    const hasRole = requiredRoles.some((role) => role === user.role);

    if (!hasRole) {
      // Log para debug no terminal do VS Code
      console.log(`[RolesGuard] Acesso negado. Usuário tem role: ${user.role}, mas a rota exige: ${requiredRoles}`);
      
      throw new ForbiddenException(
        `Seu nível de acesso (${user.role}) não permite executar esta ação.`,
      );
    }

    return true;
  }
}