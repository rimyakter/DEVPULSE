import type { NextFunction, Request, Response } from "express";
import type { UserRoleType } from "../types";
declare const auth: (...roles: UserRoleType[]) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default auth;
//# sourceMappingURL=auth.d.ts.map