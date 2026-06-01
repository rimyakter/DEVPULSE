import express, {} from "express";
import { Pool } from "pg";
import config from "./config";
const app = express();
const port = config.port;
app.use(express.json());
const pool = new Pool({
    connectionString: config.connectionString,
});
const initDB = async () => {
    try {
        await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'contributor'
            CHECK (role IN ('contributor', 'maintainer')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);
        console.log("Database created successfully!");
    }
    catch (error) {
        console.log(error);
    }
};
initDB();
app.get("/api", (req, res) => {
    res.status(200).json({
        message: "Hello World!",
        author: "Devpulse",
    });
});
app.post("/api/users", async (req, res) => {
    try {
        {
            const { name, email, password, role } = req.body;
            const result = await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
    `, [name, email, password, role]);
            res.status(201).json({
                success: true,
                message: "User created successfully!",
                data: result.rows[0],
            });
        }
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query(`SELECT id, name, email, role, created_at, updated_at FROM users`);
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully!",
            data: result.rows,
        });
    }
    catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
app.get("/api/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await pool.query(`SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1`, [userId]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not Found!",
                data: {},
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "User retrieved successfully!",
                data: result.rows[0],
            });
        }
    }
    catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
app.put("/api/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, password, role } = req.body;
        const result = await pool.query(`
      UPDATE users
      SET 
      name = COALESCE($1, name), 
      password = COALESCE($2, password), 
      role = COALESCE($3, role), 
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name, email, role, created_at, updated_at
    `, [name, password, role, userId]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not Found!",
                data: {},
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "User updated successfully!",
                data: result.rows[0],
            });
        }
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
app.delete("/api/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [userId]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not Found!",
                data: {},
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully!",
                data: result.rows[0],
            });
        }
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=server.js.map