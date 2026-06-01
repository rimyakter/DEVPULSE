import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";
const app: Application = express();
app.use(express.json());

app.use("/api/users", userRoute);

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
    author: "Devpulse",
  });
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at, updated_at FROM users`,
    );
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await pool.query(
      `SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not Found!",
        data: {},
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User retrieved successfully!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, password, role } = req.body;
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
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not Found!",
        data: {},
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [userId],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not Found!",
        data: {},
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

export default app;
