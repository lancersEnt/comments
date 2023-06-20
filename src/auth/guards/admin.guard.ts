import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { AuthenticationError } from '@nestjs/apollo';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  isAdmin(roles: string[]) {
    return roles.includes('admin');
  }
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    if (request.user) {
      const user = <any>request.user;
      if (this.isAdmin(user.permissions)) return true;
    }
    throw new AuthenticationError(
      'Could not authenticate with token or user does not have permissions',
    );
  }
}
