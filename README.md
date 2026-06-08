# 🚼 DevPulse

**Internal Tech Issue & Feature Tracker**

DevPulse is a collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions efficiently using a role-based workflow system.

---

## 🛠️ Technology Stack

| Technology   | Note                                                              |
| ------------ | ----------------------------------------------------------------- |
| Node.js      | LTS runtime (24.x or higher)                                      |
| TypeScript   | Latest stable version (no beta)                                   |
| Express.js   | Modular router architecture                                       |
| PostgreSQL   | Relational database                                               |
| Raw SQL      | Only `pool.query()` allowed (NO ORM, NO query builders, NO JOINs) |
| bcrypt       | Password hashing (salt rounds: 8–12)                              |
| jsonwebtoken | JWT-based authentication                                          |

---

## 👥 User Roles & Permissions

| Role        | Permissions                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| contributor | • Register & login<br>• Create issues<br>• View issues<br>• Update own issues                      |
| maintainer  | • All contributor permissions<br>• Update any issue<br>• Delete any issue<br>• Change issue status |

---

## 🔐 Authentication & Authorization

### JWT Flow

Client → Login → Server validates credentials → JWT issued → Client sends token in:
Authorization: <JWT_TOKEN>

Server verifies:

- Token validity
- Expiry
- Role permissions

### Security Rules

- Passwords are never returned or logged
- Protected routes require valid JWT
- Role-based access enforced on every privileged action

---

## 🗄️ Database Schema

---

### 👤 users

| Field      | Description                                      |
| ---------- | ------------------------------------------------ |
| id         | Auto-increment primary key                       |
| name       | Full name (required)                             |
| email      | Unique login email (required)                    |
| password   | Hashed password (never returned)                 |
| role       | contributor or maintainer (default: contributor) |
| created_at | Auto-generated timestamp                         |
| updated_at | Auto-updated timestamp                           |

---

### 🐞 issues

| Field       | Description                      |
| ----------- | -------------------------------- |
| id          | Auto-increment primary key       |
| title       | Max 150 chars                    |
| description | Min 20 chars                     |
| type        | bug or feature_request           |
| status      | open, in_progress, resolved      |
| reporter_id | User ID (validated in app logic) |
| created_at  | Auto timestamp                   |
| updated_at  | Auto timestamp                   |

---

## 🌐 API Endpoints

---

# 🔹 Authentication Module

---

## 1. User Registration

**POST** `/api/auth/signup`

### Body

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}

2. User Login

POST /api/auth/login

Body

{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}

👤 Users Module (NEW)
3. Get All Users (Maintainer Only)

GET /api/users

Headers
Authorization: <JWT_TOKEN>
Response
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@devpulse.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    }
  ]
}
4. Get User Profile (Self)

GET /api/users/me

Headers
Authorization: <JWT_TOKEN>
Description

Returns logged-in user's profile from decoded JWT.

5. Get User by ID (Maintainer Only)

GET /api/users/:id

6. Update User (Self or Maintainer)

PATCH /api/users/:id

Body
{
  "name": "Updated Name",
  "email": "newemail@devpulse.com",
  "role": "maintainer"
}
7. Delete User (Maintainer Only)

DELETE /api/users/:id

🐞 Issues Module
8. Create Issue

POST /api/issues

9. Get All Issues

GET /api/issues?sort=newest&type=bug&status=open

10. Get Single Issue

GET /api/issues/:id

11. Update Issue

PATCH /api/issues/:id

12. Delete Issue (Maintainer Only)

DELETE /api/issues/:id

🚨 Response Patterns
Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
Error Response
{
  "success": false,
  "message": "Error description",
  "errors": "Optional details"
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
500	Internal Server Error
🧠 Notes & Constraints
❌ No ORMs allowed
❌ No query builders allowed
❌ No SQL JOINs
✔ Use raw pool.query() only
✔ Fetch related data manually in multiple queries
✔ Use JWT payload: { id, name, role }
🚀 Project Goal

Build a clean, secure, role-based issue tracking API with strict backend constraints to demonstrate:

Authentication design
Authorization logic
Raw SQL handling
Modular Express architecture
Scalable API structure

---

If you want, I can also generate:
- :contentReference[oaicite:0]{index=0}
- :contentReference[oaicite:1]{index=1}
- :contentReference[oaicite:2]{index=2}
- :contentReference[oaicite:3]{index=3}
- :contentReference[oaicite:4]{index=4}

Just tell me 👍
```
