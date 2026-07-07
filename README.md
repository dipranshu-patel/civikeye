# Civikeye

A full-stack civic issue reporting and management platform that empowers citizens to report local problems, community volunteers to verify reports, and government departments to track and resolve civic issues efficiently.

**[🔗 Live Demo](https://your-live-link-here.com)** ← _replace with your deployed URL_

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Getting Started (Local - Manual Setup)](#getting-started-local--manual-setup)
- [Getting Started (Docker)](#getting-started-docker)
- [Database Migrations](#database-migrations)
- [Environment Variables Reference](#environment-variables-reference)
- [API Endpoints](#api-endpoints)
- [Available Scripts](#available-scripts)
- [Authentication Flows](#authentication-flows)
- [Points & Gamification System](#points--gamification-system)
- [Verification System](#verification-system)
- [Scheduled Jobs](#scheduled-jobs)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

---

## Overview

Civikeye bridges the gap between citizens and local authorities. Citizens can submit geo-tagged complaints with photos, community volunteers can verify and upvote issues, and department officials can track SLA timelines and update resolution status - all in one unified platform.

---

## Features

### Citizens

- Register / login with email & password (JWT-based, HTTP-only cookies)
- Email verification on signup
- Report civic issues (potholes, street lights, garbage, etc.) with photo uploads
- Attach geo-location and address to complaints
- Upvote existing complaints to boost visibility
- Track complaint status in real time
- Receive in-app notifications on status updates
- Manage account preferences and profile

### Volunteers

- Browse open complaints
- Verify or reject community reports
- Accept volunteer tasks
- Earn contribution points for verifications and task completions

### Department Officials (`dept`)

- View complaints assigned to their department
- Update complaint status (open → in-progress → resolved)
- Monitor SLA deadlines and receive escalation alerts
- Access department performance analytics

### Admin

- Manage departments and SLA categories
- View audit logs
- Oversee platform-wide statistics

---

## Tech Stack

**Frontend**

- React 19 + Vite
- Tailwind CSS v4
- Redux Toolkit + React-Redux
- React Router v7
- Axios
- Lucide React (icons)

**Backend**

- Node.js + Express 5
- PostgreSQL (via `pg`)
- JWT Authentication (access + refresh tokens, HTTP-only cookies)
- Resend (verification emails)
- Cloudinary (image uploads)
- `node-cron` (scheduled background jobs)
- Helmet, CORS, express-rate-limit (security)
- Morgan (HTTP logging)

**Infrastructure / DevOps**

- Docker + Docker Compose
- Nginx (serves built frontend in Docker)
- PostgreSQL 16 (Docker container for local dev)
- Compatible with Supabase / Neon / Amazon RDS (via `DATABASE_URL`)

---

## Folder Structure

```
civikeye/
├── backend/          # Express REST API
│   ├── src/
│   │   ├── features/     # Feature modules (auth, complaints, volunteer, admin...)
│   │   ├── shared/       # Common utilities, middleware, DB helpers
│   │   ├── jobs/         # Cron jobs
│   │   └── config/       # Application configuration
│   └── package.json
│
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── features/     # Citizen, Department, Admin modules
│   │   ├── shared/       # Reusable components & services
│   │   └── site/         # Public website pages
│   └── package.json
│
└── docker-compose.yml
```

---

## Prerequisites

Make sure the following are installed before running the project manually:

| Tool                                      | Version | Notes                                  |
| ----------------------------------------- | ------- | -------------------------------------- |
| [Node.js](https://nodejs.org/)            | v20+    | Required for both frontend and backend |
| [npm](https://www.npmjs.com/)             | v10+    | Comes with Node.js                     |
| [PostgreSQL](https://www.postgresql.org/) | v14+    | Or use Docker / Supabase / Neon        |
| [Docker](https://www.docker.com/)         | Latest  | Only needed for Docker setup           |
| [Git](https://git-scm.com/)               | Latest  | For cloning the repository             |

---

## Getting Started (Local — Manual Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/dipranshu-patel/civikeye.git
cd civikeye
```

---

### 2. Setup Backend

Open a terminal in the project root:

```bash
cd backend
npm install
```

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `backend/.env` with your credentials (see [Environment Variables Reference](#environment-variables-reference)).

Run database migrations:

```bash
npm run migrate
```

Start the development server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

---

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

### 4. Setup PostgreSQL

**Option A — Local PostgreSQL:**

```bash
# Create the database manually
psql -U postgres -c "CREATE DATABASE civikeye_db;"
```

Set `DATABASE_URL` in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/civikeye_db
DB_SSL=false
```

**Option B — Supabase / Neon (Cloud):**

1. Create a project on [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. Copy your connection string and set it as `DATABASE_URL` in `backend/.env`
3. Set `DB_SSL=true`

---

## Getting Started (Docker)

Docker Compose spins up the full stack (PostgreSQL + Backend + Frontend) with a single command.

### 1. Clone the Repository

```bash
git clone https://github.com/dipranshu-patel/civikeye.git
cd civikeye
```

### 2. Configure Backend Environment

```bash
cp backend/.env.example backend/.env
```

Fill in your values in `backend/.env` (Resend API key, Cloudinary, JWT secrets, etc.).  
The `DATABASE_URL` is automatically overridden by `docker-compose.yml` to point to the local Postgres container.

### 3. Start All Services

```bash
docker compose up --build
```

| Service      | URL                                |
| ------------ | ---------------------------------- |
| Frontend     | `http://localhost:8080`            |
| Backend API  | `http://localhost:5000`            |
| Health check | `http://localhost:5000/api/health` |
| PostgreSQL   | `localhost:5432`                   |

### 4. Run Migrations (First Time)

```bash
docker compose exec backend node src/shared/db/migrate.js
```

### 5. Stop Services

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

---

## Database Migrations

Migration files are plain SQL located in:

```
backend/src/shared/db/migrations/
```

Run all pending migrations with:

```bash
cd backend
npm run migrate
# or via Docker:
docker compose exec backend node src/shared/db/migrate.js
```

---

## Environment Variables Reference

Copy the example file and fill in your values — all variables are documented inside it:

```bash
cp backend/.env.example backend/.env
```

The most critical ones to set before running:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens (use a long random string) |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens (different from above) |
| `RESEND_API_KEY` | [Resend](https://resend.com) API key — required for emails |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | Required for photo uploads |
| `FRONTEND_URL` | Your frontend origin — used for CORS (e.g. `http://localhost:5173`) |

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Endpoints

All routes are prefixed with `/api`. Core groups:

| Prefix | Access | Purpose |
| --- | --- | --- |
| `/api/auth` | Public | Register, login, logout, email verification, password reset |
| `/api/me` | Auth | Current user profile & own complaints |
| `/api/complaints` | Public / Auth | Browse, submit, upvote complaints |
| `/api/volunteer` | Auth | Volunteer tasks & verifications |
| `/api/dept` | Dept | Department dashboard & status updates |
| `/api/admin` | Admin | User, department & SLA management |
| `/api/notifications` | Auth | In-app notifications |

Health check: `GET /api/health`

---

## Available Scripts

### Backend (`cd backend`)

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start with nodemon (auto-reload on file changes) |
| `npm start`       | Start in production mode                         |
| `npm run migrate` | Run all pending SQL migrations                   |

### Frontend (`cd frontend`)

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server (hot reload)   |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint checks                    |

### Docker

| Command                        | Description                         |
| ------------------------------ | ----------------------------------- |
| `docker compose up --build`    | Build and start all services        |
| `docker compose up -d`         | Start in detached (background) mode |
| `docker compose down`          | Stop all services                   |
| `docker compose down -v`       | Stop and delete volumes (DB data)   |
| `docker compose logs backend`  | View backend logs                   |
| `docker compose logs frontend` | View frontend logs                  |

---

## Authentication Flows

### Register

1. User submits name, email, password
2. A verification otp is sent via Resend
3. User enters and verify the otp
4. Account is created and user can now log in

### Login

1. User submits email + password
2. Server validates credentials and issues:
    - **Access Token** (short-lived, e.g. 15 min) — stored in local storage
    - **Refresh Token** (long-lived, e.g. 30 days) — stored in HTTP-only cookie
3. Frontend uses the access token for API calls; the refresh token silently renews it

### Password Reset

1. User requests reset → email with a time-limited link is sent
2. User clicks link → submits new password
3. All existing refresh tokens are invalidated

### Role-Based Access

| Role      | Access Level                                  |
| --------- | --------------------------------------------- |
| `citizen` | Submit complaints, upvote, volunteer          |
| `dept`    | Department dashboard, update complaint status |
| `admin`   | Full platform management                      |

---

## Points System

Civikeye incentivizes citizen participation through a contribution points system:

| Action                   | Points Earned |
| ------------------------ | ------------- |
| Reported complaint resolved       | +10           |
| Cast a verification vote | +5            |
| Community-resolved issue | +25           |

Points are recorded in the `contributions` table and can be surfaced in leaderboards and user profile.  

---

## Verification System

When a complaint resolution is submitted, citizens within a configurable geo-radius (`VERIFICATION_RADIUS_KM`) can verify or reject it.

**Verification flow:**

1. Complaint resolution is submitted → verification window opens (`VERIFICATION_WINDOW_DAYS`)
2. Citizens in the area cast votes (confirm / reject)
3. After the window closes (or enough votes are cast), the system auto-evaluates:
    - If `confirm_votes / total_votes >= VERIFICATION_CONFIRM_THRESHOLD` → complaint is **verified**
    - Otherwise → **rejected**
4. Minimum votes required: `VERIFICATION_MIN_VOTES_COMMUNITY` (community) / `VERIFICATION_MIN_VOTES_AUTHORITY` (authority)

The verification window job runs on a schedule and auto-closes expired windows.

---

## Scheduled Jobs

Background cron jobs are registered in `backend/src/jobs/scheduler.js`:

| Job                          | Description                                                              |
| ---------------------------- | ------------------------------------------------------------------------ |
| `verification-window.job.js` | Auto-closes expired verification windows and evaluates results           |
| `sla-notifications.job.js`   | Sends escalation alerts when complaints approach or breach SLA deadlines |

---

## Troubleshooting

**Port already in use**  
Change `PORT` in `backend/.env` and update `VITE_API_URL` in `frontend/.env` to match.

**API calls failing / CORS errors**

- Ensure `VITE_API_URL` ends with `/api` — e.g. `http://localhost:5000/api`
- Ensure `FRONTEND_URL` in `backend/.env` matches the URL your browser uses (e.g. `http://localhost:5173`)

**Emails not being sent**

- Check your `RESEND_API_KEY` is valid and `EMAIL_FROM` is a verified domain in Resend
- In development, add `SKIP_EMAIL=true` to skip sending real emails

**Database connection error**

- Verify `DATABASE_URL` is correct in `backend/.env`
- Ensure PostgreSQL is running (or the Docker `db` container is healthy)
- For cloud DBs (Supabase, Neon), set `DB_SSL=true`
- Run `npm run migrate` if tables are missing

---

## Future Improvements

- Live map view of complaints with clustering
- Real-time status updates via WebSockets
- Mobile app (React Native)
- Payment / crowdfunding for community fixes
- AI-powered complaint categorization
- Advanced admin analytics dashboard
- Multi-language (i18n) support
- Push notifications (web + mobile)
- OAuth / social login (Google, GitHub)
