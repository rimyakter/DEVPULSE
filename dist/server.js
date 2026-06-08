

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/modules/user/user.route.ts
import { Router } from "express";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  connectionString: process.env.CONNECTION_STRING,
  port: process.env.PORT || 3e3,
  jwtSecret: process.env.JWT_SECRET
};
var config_default = config;

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.connectionString
});
var initDB = async () => {
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
    await pool.query(`
    CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        bio TEXT,
        address TEXT,
        phone VARCHAR(20),
        gender VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
          id SERIAL PRIMARY KEY,
          title VARCHAR(150) NOT NULL,
          description TEXT NOT NULL
              CHECK (LENGTH(description) >= 20),
          type VARCHAR(20) NOT NULL
              CHECK (type IN ('bug', 'feature_request')),
          status VARCHAR(20) NOT NULL DEFAULT 'open'
              CHECK (status IN ('open', 'in_progress', 'resolved')),
          reporter_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log("Database created successfully!");
  } catch (error) {
    console.log(error);
  }
};

// src/modules/user/user.service.ts
import bcrypt from "bcryptjs";
var createUserIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
      RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashedPassword, role]
  );
  return result;
};
var getAllUsersFromDB = async () => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at, updated_at FROM users`
  );
  return result;
};
var getSingleUserFromDB = async (userId) => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1`,
    [userId]
  );
  return result;
};
var updateUserInDB = async (userId, payload) => {
  const { name, password, role } = payload;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : void 0;
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
    [name, hashedPassword, role, userId]
  );
  return result;
};
var deleteUserFromDB = async (userId) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId]
  );
  return result;
};
var userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB
};

// src/utility/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error
  });
};
var sendResponse_default = sendResponse;

// src/modules/user/user.controller.ts
var createUser = async (req, res) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsersFromDB();
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully!",
      data: result.rows
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await userService.getSingleUserFromDB(userId);
    if (result.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not Found!",
        data: {}
      });
    } else {
      sendResponse_default(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully!",
        data: result.rows[0]
      });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, password, role } = req.body;
    const result = await userService.updateUserInDB(userId, {
      name,
      password,
      role
    });
    if (result.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not Found!",
        data: {}
      });
    } else {
      sendResponse_default(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully!",
        data: result.rows[0]
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await userService.deleteUserFromDB(userId);
    if (result.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not Found!",
        data: {}
      });
    } else {
      sendResponse_default(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully!",
        data: result.rows[0]
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};

// src/middleware/auth.ts
import jwt from "jsonwebtoken";
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          status: "false",
          message: "Unauthorized Access"
        });
      }
      const decodedToken = jwt.verify(
        token,
        config_default.jwtSecret
      );
      const userData = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [decodedToken.email]
      );
      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        return res.status(404).json({
          status: "false",
          message: "User not found"
        });
      }
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          status: "false",
          message: "Forbidden Access"
        });
      }
      req.user = decodedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/types/index.ts
var UserRole = {
  maintainer: "maintainer",
  contributor: "contributor"
};

// src/modules/user/user.route.ts
var router = Router();
router.post("/", userController.createUser);
router.get("/", auth_default(UserRole.maintainer), userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
var userRoute = router;

// src/modules/profile/profile.route.ts
import { Router as Router2 } from "express";

// src/modules/profile/profile.service.ts
var createProfileIntoDb = async (payload) => {
  const { user_id, bio, address, phone, gender } = payload;
  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
  if (user.rows.length === 0) {
    throw new Error("User not found");
  }
  const result = await pool.query(
    `
      INSERT INTO profiles (user_id, bio, address, phone, gender)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, bio, address, phone, gender, created_at, updated_at
    `,
    [user_id, bio, address, phone, gender]
  );
  return result;
};
var profileService = {
  createProfileIntoDb
};

// src/modules/profile/profile.controller.ts
var createProfile = async (req, res) => {
  try {
    const result = await profileService.createProfileIntoDb(req.body);
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
var profileController = {
  createProfile
};

// src/modules/profile/profile.route.ts
var router2 = Router2();
router2.post("/", profileController.createProfile);
var profileRoute = router2;

// src/modules/issue/issue.route.ts
import { Router as Router3 } from "express";

// src/modules/issue/issue.service.ts
var createIssueIntoDb = async (payload) => {
  const { title, description, type, status, reporter_id } = payload;
  const result = await pool.query(
    `
      INSERT INTO issues (title, description, type, status, reporter_id)
      VALUES ($1, $2, $3, COALESCE($4, 'open'), $5)
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, status, reporter_id]
  );
  return result;
};
var getAllIssuesFromDb = async (filters) => {
  const values = [];
  const whereClauses = [];
  let query = `
    SELECT 
      id,
      title,
      description,
      type,
      status,
      reporter_id,
      created_at,
      updated_at
    FROM issues
  `;
  if (filters.type) {
    values.push(filters.type);
    whereClauses.push(`type = $${values.length}`);
  }
  if (filters.status) {
    values.push(filters.status);
    whereClauses.push(`status = $${values.length}`);
  }
  if (whereClauses.length > 0) {
    query += ` WHERE ` + whereClauses.join(" AND ");
  }
  query += filters.sort === "oldest" ? ` ORDER BY created_at ASC` : ` ORDER BY created_at DESC`;
  const issuesResult = await pool.query(query, values);
  const issues = issuesResult.rows;
  if (issues.length === 0) return issuesResult;
  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];
  const usersResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds]
  );
  const userMap = new Map(usersResult.rows.map((u) => [u.id, u]));
  const enrichedIssues = issues.map((issue) => {
    const { reporter_id } = issue;
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: userMap.get(reporter_id) || null,
      created_at: issue.created_at,
      updated_at: issue.updated_at
    };
  });
  return { rows: enrichedIssues };
};
var getSingleIssueFromDb = async (issueId) => {
  const result = await pool.query(
    `
    SELECT 
      id,
      title,
      description,
      type,
      status,
      reporter_id,
      created_at,
      updated_at
    FROM issues 
    WHERE id = $1
    `,
    [issueId]
  );
  const issue = result.rows[0];
  if (!issue) return null;
  const userResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id]
  );
  const reporter = userResult.rows[0] || null;
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at
  };
};
var updateIssueIntoDb = async (issueId, payload, user) => {
  const issueResult = await pool.query(
    `
    SELECT id, reporter_id, status
    FROM issues
    WHERE id = $1
    `,
    [issueId]
  );
  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error("Issue not found");
  }
  const isMaintainer = user.role === "maintainer";
  const isOwner = issue.reporter_id === user.id;
  const isOpen = issue.status === "open";
  if (!isMaintainer && !(isOwner && isOpen)) {
    const err = new Error("Forbidden: You cannot update this issue");
    err.statusCode = 403;
    throw err;
  }
  const { title, description, type, status } = payload;
  const result = await pool.query(
    `
      UPDATE issues
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        status = COALESCE($4, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, status, issueId]
  );
  return result;
};
var deleteIssueFromDb = async (issueId) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING id`,
    [issueId]
  );
  return result;
};
var issueService = {
  createIssueIntoDb,
  getAllIssuesFromDb,
  getSingleIssueFromDb,
  updateIssueIntoDb,
  deleteIssueFromDb
};

// src/modules/issue/issue.controller.ts
var createIssue = async (req, res) => {
  try {
    const reporter_id = req.user?.id;
    if (!reporter_id) {
      return sendResponse_default(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await issueService.createIssueIntoDb({
      ...req.body,
      reporter_id
    });
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getAllIssues = async (req, res) => {
  try {
    const { sort, type, status } = req.query;
    const result = await issueService.getAllIssuesFromDb({
      sort,
      type,
      status
    });
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result.rows
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getSingleIssue = async (req, res) => {
  const issueId = req.params.id;
  try {
    const issue = await issueService.getSingleIssueFromDb(issueId);
    if (!issue) {
      return sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
        data: {}
      });
    }
    return sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully",
      data: issue
    });
  } catch (error) {
    return sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var updateIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const result = await issueService.updateIssueIntoDb(
      issueId,
      req.body,
      req.user
      // 👈 required for authorization logic
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var deleteIssue = async (req, res) => {
  const issueId = req.params.id;
  try {
    const result = await issueService.deleteIssueFromDb(issueId);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue
};

// src/modules/issue/issue.route.ts
var router3 = Router3();
router3.post(
  "/",
  auth_default(UserRole.maintainer, UserRole.contributor),
  issueController.createIssue
);
router3.get("/", issueController.getAllIssues);
router3.get("/:id", issueController.getSingleIssue);
router3.patch("/:id", auth_default(UserRole.maintainer, UserRole.contributor), issueController.updateIssue);
router3.delete("/:id", auth_default(UserRole.maintainer), issueController.deleteIssue);
var issueRoute = router3;

// src/modules/auth/auth.route.ts
import { Router as Router4 } from "express";

// src/modules/auth/auth.service.ts
import bcrypt2 from "bcryptjs";
import jwt2 from "jsonwebtoken";
var signupUserIntoDb = async (payload) => {
  const { name, email, password, role = "contributor" } = payload;
  const hashedPassword = await bcrypt2.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};
var loginUserIntoDb = async (payload) => {
  const { email, password } = payload;
  try {
    const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
      email
    ]);
    if (userData.rows.length === 0) {
      throw new Error("Invalid credentials");
    }
    const user = userData.rows[0];
    const matchPassword = await bcrypt2.compare(password, user.password);
    if (!matchPassword) {
      throw new Error("Invalid credentials");
    }
    const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
    const accessToken = jwt2.sign(jwtPayload, config_default.jwtSecret, {
      expiresIn: "1d"
    });
    return {
      token: accessToken,
      user: jwtPayload
    };
  } catch (error) {
    throw new Error("Error logging in user: " + error.message);
  }
};
var authService = {
  loginUserIntoDb,
  signupUserIntoDb
};

// src/modules/auth/auth.controller.ts
var signupUser = async (req, res) => {
  try {
    const result = await authService.signupUserIntoDb(req.body);
    console.log(result);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var loginUser = async (req, res) => {
  try {
    const result = await authService.loginUserIntoDb(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var authController = {
  loginUser,
  signupUser
};

// src/modules/auth/auth.route.ts
var router4 = Router4();
router4.post("/login", authController.loginUser);
router4.post("/signup", authController.signupUser);
var authRoute = router4;

// src/middleware/logger.ts
import fs from "fs";
var logger = (req, res, next) => {
  console.log("Method - Url - Time:", req.method, req.url, Date.now());
  const logData = `Method : ${req.method} - Url: ${req.url} - Time: ${(/* @__PURE__ */ new Date()).toISOString()}
`;
  fs.appendFile("logger.txt", logData, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
  next();
};
var logger_default = logger;

// src/app.ts
import cors from "cors";

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/app.ts
var app = express();
app.use(express.json());
app.use(logger_default);
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Hello World!",
    author: "Devpulse"
  });
});
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/issues", issueRoute);
app.use("/api/auth", authRoute);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var main = () => {
  app_default.listen(config_default.port, () => {
    initDB();
    console.log(`Example app listening on port ${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.js.map