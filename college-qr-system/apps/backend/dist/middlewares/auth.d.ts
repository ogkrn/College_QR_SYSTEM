import { NextFunction, Response } from "express";
export declare function authMiddleware(req: any, res: Response, next: NextFunction): void;
export declare function requireRole(role: string): (req: any, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map