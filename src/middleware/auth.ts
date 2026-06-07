import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { UserRoleType } from "../types";



const auth = (...roles: UserRoleType[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          status: "false",
          message: "Unauthorized Access",
        });
      }

      const decodedToken = jwt.verify(
        token as string,
        config.jwtSecret as string,
      ) as JwtPayload;
      const userData = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [decodedToken.email],
      );

      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        return res.status(404).json({
          status: "false",
          message: "User not found",
        });
      }

      //role-based access control

      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          status: "false",
          message: "Forbidden Access",
        });
      }

      req.user = decodedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
