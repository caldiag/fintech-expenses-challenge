import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service.ts';
import { IS_PUBLIC_KEY } from './public.decorator.ts';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const token = req.cookies?.authorization;
    if (!token) throw new UnauthorizedException();

    try {
      const payload = this.authService.verifyToken(token);
      req.userId = payload.id;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
