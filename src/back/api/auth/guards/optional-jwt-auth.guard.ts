import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest to allow requests without authentication
  handleRequest(err: any, user: any) {
    // If there's no user or an error, just return null (allow the request to continue)
    if (err || !user) {
      return null;
    }
    return user;
  }

  // Override canActivate to always return true
  canActivate(context: ExecutionContext) {
    // Always allow the request to continue
    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
