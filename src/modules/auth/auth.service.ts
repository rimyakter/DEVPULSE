import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

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
      email: user.email,
      role: user.role,
    };
    const accessToken = jwt.sign(jwtPayload, config.jwtSecret, {
      expiresIn: "1d",
    });

    return accessToken;




  } catch (error) {
    throw new Error("Error logging in user: " + (error as Error).message);
  }
};

export const authService = {
  loginUserIntoDb,
};
