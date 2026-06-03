import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const result = await pool.query(
    `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, password, role],
  );

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at, updated_at FROM users`,
  );
  return result;
};

const getSingleUserFromDB = async (userId: string) => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1`,
    [userId],
  );

  return result;
};

const updateUserInDB = async (userId: string, payload: Partial<IUser>) => {
  const { name, password, role } = payload;
  const result = await pool.query(
    `
      UPDATE users
      SET 
      name = COALESCE($1, name), 
      password = COALESCE($2, password), 
      role = COALESCE($3, role), 
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, password, role, userId],
  );
  return result;
};

const deleteUserFromDB = async (userId: string) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId],
  );
  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
