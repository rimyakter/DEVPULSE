import { pool } from "../../db";
import bcrypt from "bcryptjs";
const createUserIntoDB = async (payload) => {
    const { name, email, password, role } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
      RETURNING id, name, email, role, created_at, updated_at
    `, [name, email, hashedPassword, role]);
    return result;
};
const getAllUsersFromDB = async () => {
    const result = await pool.query(`SELECT id, name, email, role, created_at, updated_at FROM users`);
    return result;
};
const getSingleUserFromDB = async (userId) => {
    const result = await pool.query(`SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1`, [userId]);
    return result;
};
const updateUserInDB = async (userId, payload) => {
    const { name, password, role } = payload;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const result = await pool.query(`
      UPDATE users
      SET 
      name = COALESCE($1, name), 
      password = COALESCE($2, password), 
      role = COALESCE($3, role), 
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name, email, role, created_at, updated_at
    `, [name, hashedPassword, role, userId]);
    return result;
};
const deleteUserFromDB = async (userId) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [userId]);
    return result;
};
export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserInDB,
    deleteUserFromDB,
};
//# sourceMappingURL=user.service.js.map