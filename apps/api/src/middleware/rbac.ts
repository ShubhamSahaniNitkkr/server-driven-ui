import type { Response, NextFunction } from 'express';
import { ROLE_PERMISSIONS } from '@sdui/shared';
import type { AuthenticatedRequest } from './auth.js';
import { AppError } from './errorHandler.js';

export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'Unauthorized', 'Authentication required'));
      return;
    }

    const permissions = ROLE_PERMISSIONS[req.user.role] ?? [];
    if (!permissions.includes(permission)) {
      next(new AppError(403, 'Forbidden', `Missing permission: ${permission}`));
      return;
    }

    next();
  };
}

export function getUserPermissions(role: string): string[] {
  return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] ?? [];
}
