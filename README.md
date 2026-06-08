# 🚼 DevPulse

## Internal Issue & Feature Tracking API

DevPulse is a backend system for managing bugs and feature requests with role-based access control, built using Node.js, Express, PostgreSQL, and raw SQL.

---

## 🛠️ Tech Stack

- Node.js (v24+)
- TypeScript (stable release)
- Express.js (modular architecture)
- PostgreSQL (raw SQL only via `pool.query()`)
- bcrypt (password hashing, salt 8–12)
- jsonwebtoken (JWT authentication)

> ⚠️ No ORMs, no query builders, and no SQL JOINs allowed.

---

## 👥 Roles

| Role        | Permissions                                         |
| ----------- | --------------------------------------------------- |
| contributor | Create issues, view issues, update own issues       |
| maintainer  | Full access: update/delete any issue, manage status |

---

## 🔐 Authentication

JWT-based authentication:

Authorization: <JWT_TOKEN>

### Flow

Credentials → Validate → Hash check → Issue JWT → Verify on each request

### Security Rules

- Passwords are never exposed
- All protected routes require valid JWT
- Role-based access enforced via middleware
- JWT payload includes: `id`, `name`, `role`

---

## 🗄️ Database Schema

### users

- id (PK)
- name (required)
- email (unique, required)
- password (hashed, hidden)
- role (contributor | maintainer)
- created_at
- updated_at

---

### issues

- id (PK)
- title (max 150 chars)
- description (min 20 chars)
- type (bug | feature_request)
- status (open | in_progress | resolved)
- reporter_id (validated in app logic)
- created_at
- updated_at

---

## 🌐 API Overview

---

## 🔐 Auth

### POST `/api/auth/signup`

Register a new user.

### POST `/api/auth/login`

Authenticate user and return JWT.

---

## 👤 Users

### GET `/api/users` _(maintainer)_

List all users.

### GET `/api/users/me`

Get current user profile.

### GET `/api/users/:id` _(maintainer)_

Get user by ID.

### PATCH `/api/users/:id`

Update user (self or maintainer).

### DELETE `/api/users/:id` _(maintainer)_

Remove user.

---

## 🐞 Issues

### POST `/api/issues`

Create issue (authenticated users).

### GET `/api/issues`

Get all issues (supports `sort`, `type`, `status`).

### GET `/api/issues/:id`

Get single issue.

### PATCH `/api/issues/:id`

Update issue (role-based rules apply).

### DELETE `/api/issues/:id`

Delete issue (maintainer only).

---

## 📦 Standard Responses

### Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
Error
{
  "success": false,
  "message": "Error message",
  "errors": "Details"
}
📊 HTTP Status Codes
Code	Meaning
200	OK
201	Created
204	No Content
400	Bad Request
401	Unauthorized
403	Forbidden
404	Not Found
409	Conflict
500	Server Error
🧠 Constraints
No ORMs or query builders
No SQL JOINs
Use raw pool.query() only
Handle relationships manually
Enforce JWT-based auth on protected routes
🚀 Goal

Build a secure, scalable issue tracking API demonstrating:

Authentication & authorization
Role-based access control
Raw SQL database handling
Clean Express architecture

---

If you want next level polish, I can also turn this into:
- 🟢 GitHub README with badges + logo
- 🧱 Project folder structure
- ⚙️ Production-ready backend architecture
- 🧪 API testing collection (Postman)

Just tell me 👍
```
