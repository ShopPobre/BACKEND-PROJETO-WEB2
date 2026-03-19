import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError";

type Role = "ADMIN" | "USER";

export function ensureRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.role) {
      throw new UnauthorizedError("User not authenticated");
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError("You do not have permission to access this resource");
    }

    next();
  };
}
