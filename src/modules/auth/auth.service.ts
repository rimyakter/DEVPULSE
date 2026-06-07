import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";
import type { IUser } from "./auth.interface";

const signupUserIntoDb = async (payload: IUser) => {
  const { name, email, password, role = "contributor" } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role],
  );

  return result.rows[0];
};

const loginUserIntoDb = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  //search for user in db
  try {
    const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userData.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = userData.rows[0];

    //compare passwords
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      throw new Error("Invalid credentials");
    }

    //Token generation logic can be added here (e.g., JWT)
    const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const accessToken = jwt.sign(jwtPayload, config.jwtSecret, {
      expiresIn: "1d",
    });

    

    return {
  token: accessToken,
  user: jwtPayload,
  
};
  } catch (error) {
    throw new Error("Error logging in user: " + (error as Error).message);
  }
};

const generateRefreshToken = async (token: string) => {

  
};

export const authService = {
  loginUserIntoDb,
  signupUserIntoDb,
  generateRefreshToken
};
