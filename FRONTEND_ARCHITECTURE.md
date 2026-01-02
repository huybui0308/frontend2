# 🎨 ATK-DEF Frontend Architecture Guide

**Complete Frontend Development Guide** for the **Attack-Defense CTF Platform**

This document provides everything you need to build a production-ready frontend that integrates with the Spring Boot backend API.

---

## 📚 Table of Contents

- [System Overview](#-system-overview)
- [Architecture Diagrams](#-architecture-diagrams)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [User Roles & Permissions](#-user-roles--permissions)
- [Page Structure](#-page-structure)
- [Component Architecture](#-component-architecture)
- [State Management](#-state-management)
- [Authentication Flow](#-authentication-flow)
- [Real-time Features](#-real-time-features)
- [Recommended Tech Stack](#-recommended-tech-stack)
- [Project Structure](#-recommended-project-structure)

---

## 🌐 System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React/Vue/Next.js)                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │  Auth Pages │ │  Dashboard  │ │ Scoreboard  │ │    Admin Panel          ││
│  │  - Login    │ │  - Overview │ │  - Live     │ │  - Team Management      ││
│  │  - Signup   │ │  - Profile  │ │  - Rankings │ │  - Game Control         ││
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ │  - File Uploads         ││
│         │               │               │        └──────────┬──────────────┘│
└─────────┼───────────────┼───────────────┼───────────────────┼───────────────┘
          │               │               │                   │
          ▼               ▼               ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SPRING BOOT BACKEND (localhost:8080)                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         /api/*  Endpoints                            │   │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌───────────────┐ │   │
│  │  │  /auth  │ │ /teams  │ │/scoreboard││  /game  │ │   /upload     │ │   │
│  │  │         │ │         │ │  (proxy) │ │ (proxy) │ │               │ │   │
│  │  └────┬────┘ └────┬────┘ └────┬─────┘ └────┬────┘ └───────┬───────┘ │   │
│  └───────┼──────────┼───────────┼────────────┼────────────────┼────────┘   │
│          │          │           │            │                │            │
│          ▼          ▼           │            │                ▼            │
│  ┌───────────────────────┐      │            │        ┌─────────────────┐  │
│  │     PostgreSQL DB     │      │            │        │    File System  │  │
│  │  (teams, games, etc)  │      │            │        │  ./uploads/...  │  │
│  └───────────────────────┘      │            │        └─────────────────┘  │
└─────────────────────────────────┼────────────┼──────────────────────────────┘
                                  │            │
                                  ▼            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PYTHON GAME SERVER (localhost:8000)                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CTF Core Engine: Tick Management, Flag Generation, Score Calc      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Architecture Diagrams

### High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND APPLICATION                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           PRESENTATION LAYER                             │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐  │   │
│  │  │  Login    │ │  Signup   │ │ Dashboard │ │ Scoreboard│ │   Admin   │  │   │
│  │  │   Page    │ │   Page    │ │   Page    │ │   Page    │ │   Panel   │  │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           COMPONENT LAYER                                │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│   │
│  │  │   Navbar    │ │  TeamCard   │ │ ScoreTable  │ │   GameController    ││   │
│  │  ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────────────┤│   │
│  │  │  Sidebar    │ │  UserAvatar │ │ RankPodium  │ │   FileUploader      ││   │
│  │  ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────────────┤│   │
│  │  │   Modal     │ │  GameStatus │ │ LiveTicker  │ │   TeamManager       ││   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                            STATE LAYER                                   │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────────┐│   │
│  │  │   Auth Store    │ │   Game Store    │ │     Scoreboard Store        ││   │
│  │  │  - user         │ │  - status       │ │  - teams[]                  ││   │
│  │  │  - token        │ │  - currentTick  │ │  - lastUpdated              ││   │
│  │  │  - isAdmin      │ │  - gameId       │ │  - refreshInterval          ││   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           SERVICE LAYER                                  │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────────┐│   │
│  │  │   AuthService   │ │   TeamService   │ │      GameService            ││   │
│  │  │  - login()      │ │  - getAll()     │ │  - start(), stop()          ││   │
│  │  │  - signup()     │ │  - create()     │ │  - getStatus()              ││   │
│  │  │  - getMe()      │ │  - update()     │ │  - getScoreboard()          ││   │
│  │  │  - logout()     │ │  - delete()     │ │                             ││   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        HTTP CLIENT (Axios/Fetch)                         │   │
│  │  - Base URL: http://localhost:8080/api                                   │   │
│  │  - Auth Header: Bearer <token>                                           │   │
│  │  - Content-Type: application/json                                        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Authentication Flow Diagram

```
┌─────────────┐           ┌─────────────┐           ┌─────────────┐
│   FRONTEND  │           │   BACKEND   │           │  DATABASE   │
└──────┬──────┘           └──────┬──────┘           └──────┬──────┘
       │                         │                         │
       │  1. POST /api/auth/login│                         │
       │  { username, password } │                         │
       │────────────────────────>│                         │
       │                         │  2. Find user by        │
       │                         │     username            │
       │                         │────────────────────────>│
       │                         │                         │
       │                         │  3. Return user data    │
       │                         │<────────────────────────│
       │                         │                         │
       │                         │  4. Verify BCrypt       │
       │                         │     password            │
       │                         │                         │
       │                         │  5. Generate JWT        │
       │                         │     (24h expiry)        │
       │                         │                         │
       │  6. Return JWT Response │                         │
       │  { token, type: Bearer, │                         │
       │    id, username, roles }│                         │
       │<────────────────────────│                         │
       │                         │                         │
       │  7. Store token in      │                         │
       │     localStorage        │                         │
       │                         │                         │
       │  8. Redirect to         │                         │
       │     Dashboard           │                         │
       │                         │                         │
       ▼                         ▼                         ▼

===== SUBSEQUENT REQUESTS =====

       │  GET /api/auth/me       │                         │
       │  Header: Bearer <token> │                         │
       │────────────────────────>│                         │
       │                         │  Validate JWT           │
       │                         │  Extract user ID        │
       │                         │────────────────────────>│
       │                         │<────────────────────────│
       │  { id, username,        │                         │
       │    teamName, role }     │                         │
       │<────────────────────────│                         │
       ▼                         ▼                         ▼
```

---

## 📡 API Reference

### Base Configuration

```javascript
const API_BASE_URL = 'http://localhost:8080/api';

// Standard Headers
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // For protected routes
};
```

### Standard Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

---

### 🔓 Public Endpoints (No Auth Required)

#### `POST /api/auth/login` - User Login

```typescript
// Request
interface LoginRequest {
  username: string;
  password: string;
}

// Response
interface LoginResponse {
  token: string;
  type: "Bearer";
  id: number;
  username: string;
  teamName: string;
  roles: string[];  // ["ROLE_TEAM"] or ["ROLE_ADMIN"] or ["ROLE_TEACHER"]
}

// Example
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'team1', password: 'password123' })
});
```

#### `POST /api/auth/signup` - Register New Team

```typescript
// Request
interface SignupRequest {
  username: string;
  password: string;
  teamName: string;
  country?: string;
  affiliation?: string;
}

// Response
interface SignupResponse {
  message: "Team registered successfully!";
  teamId: number;
}
```

#### `GET /api/teams` - List All Teams (Public)

```typescript
// Response
interface TeamPublic {
  id: number;
  name: string;
  country?: string;
  affiliation?: string;
}

// Response: TeamPublic[]
```

#### `GET /api/scoreboard` - Live Scoreboard

```typescript
// Response (proxied from Python Game Server)
interface ScoreboardResponse {
  game_id: string;
  current_tick: number;
  teams: Array<{
    team_id: number | string;
    name: string;
    score: number;
    attack_points: number;
    defense_points: number;
    sla_points: number;
    rank: number;
    flags_captured: number;
    flags_lost: number;
  }>;
}
```

---

### 🔐 Protected Endpoints (Auth Required)

> **Headers:** `Authorization: Bearer <your-jwt-token>`

#### `GET /api/auth/me` - Get Current User

```typescript
// Response
interface CurrentUserResponse {
  id: number;
  username: string;
  teamName: string;
  role: "ADMIN" | "TEACHER" | "TEAM";
}
```

---

### 👑 Admin/Teacher Only Endpoints

> **Required Role:** `ROLE_ADMIN` or `ROLE_TEACHER`

#### `POST /api/teams` - Create New Team

```typescript
// Request
interface CreateTeamRequest {
  name: string;
  country?: string;
  affiliation?: string;
  ipAddress?: string;
}

// Response
interface CreateTeamResponse {
  success: true;
  id: number;
  name: string;
  username: string;        // Auto-generated
  defaultPassword: string; // ⚠️ Show only once!
  message: string;
}
```

#### `PUT /api/teams/{id}` - Update Team

```typescript
// Request
interface UpdateTeamRequest {
  name?: string;
  country?: string;
  affiliation?: string;
  ipAddress?: string;
}

// Response
interface UpdateTeamResponse {
  id: number;
  updated: true;
}
```

#### `DELETE /api/teams/{id}` - Delete Team

```typescript
// Response
{
  message: "Team deleted successfully"
}
```

#### `POST /api/teams/bulk` - Bulk Import Teams from CSV

```typescript
// Request: multipart/form-data
// Form field: file (CSV file)

// CSV Format:
// name,country,affiliation,ip_address
// Team A,Vietnam,HUST,10.0.0.1
// Team B,Japan,Tokyo U,10.0.0.2

// Response
interface BulkImportResponse {
  success: true;
  imported_count: number;
  teams: Array<{
    id: number;
    name: string;
    username: string;
    password: string;  // ⚠️ Save these!
  }>;
}
```

#### `POST /api/upload/checker` - Upload Checker Script

```typescript
// Request: multipart/form-data
// Form fields:
//   - file: .py file
//   - challengeId: number

// Response
interface UploadResponse {
  success: true;
  filename: string;
  path: string;
  challengeId: number;
}
```

#### `POST /api/upload/vulnbox` - Upload VulnBox

```typescript
// Request: multipart/form-data
// Form fields:
//   - file: .zip file
//   - challengeId: number

// Response (202 Accepted - async job)
interface UploadResponse {
  success: true;
  filename: string;
  path: string;
  challengeId: number;
}
```

#### `GET /api/game/status` - Get Game Status

```typescript
// Response (proxied from Python)
interface GameStatusResponse {
  id: string;           // UUID
  name: string;
  status: "DRAFT" | "DEPLOYING" | "RUNNING" | "PAUSED" | "FINISHED";
  current_tick: number;
  tick_duration_seconds: number;
  start_time?: string;  // ISO timestamp
  end_time?: string;
  created_at: string;
}
```

#### `POST /api/game/start` - Start CTF Game

```typescript
// Response
interface GameStartResponse {
  success: true;
  message: "Game started";
  game_id: string;
}

// Error Response (if vulnbox not uploaded)
{
  detail: "Vulnbox not uploaded",
  status: 400,
  success: false
}
```

#### `POST /api/game/stop` - Stop CTF Game

```typescript
// Response
interface GameStopResponse {
  success: true;
  message: "Game stopped";
}
```

---

## 📦 Data Models

### TypeScript Interfaces

```typescript
// ================= USER & AUTH =================

interface User {
  id: number;
  username: string;
  teamName: string;
  role: UserRole;
  token?: string;
}

type UserRole = 'ADMIN' | 'TEACHER' | 'TEAM';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ================= TEAM =================

interface Team {
  id: number;
  username: string;
  name: string;
  affiliation?: string;
  country?: string;
  ipAddress?: string;
  createdAt: string;
}

interface TeamCreatedWithCredentials extends Team {
  defaultPassword: string;  // Only available on creation
}

// ================= GAME =================

interface Game {
  id: string;  // UUID
  name: string;
  description?: string;
  vulnboxPath?: string;
  checkerModule?: string;
  status: GameStatus;
  tickDurationSeconds: number;
  currentTick: number;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

type GameStatus = 
  | 'DRAFT'      // Game created but not started
  | 'DEPLOYING'  // Setting up containers
  | 'RUNNING'    // Game is live
  | 'PAUSED'     // Game temporarily paused
  | 'FINISHED';  // Game ended

// ================= SCOREBOARD =================

interface ScoreboardTeam {
  teamId: number | string;
  name: string;
  rank: number;
  totalScore: number;
  attackPoints: number;
  defensePoints: number;
  slaPoints: number;
  flagsCaptured: number;
  flagsLost: number;
}

interface Scoreboard {
  gameId: string;
  currentTick: number;
  teams: ScoreboardTeam[];
  lastUpdated: string;
}

// ================= SERVICE STATUS =================

type CheckStatus = 'OK' | 'DOWN' | 'MUMBLE' | 'CORRUPT' | 'ERROR';

interface ServiceStatus {
  teamId: string;
  tickId: string;
  status: CheckStatus;
  slaPercentage: number;
  errorMessage?: string;
  checkDurationMs: number;
  checkedAt: string;
}

// ================= FLAG SUBMISSION =================

type SubmissionStatus = 
  | 'ACCEPTED'   // Valid flag, points awarded
  | 'REJECTED'   // Invalid flag format
  | 'DUPLICATE'  // Already submitted
  | 'EXPIRED'    // Flag too old
  | 'OWN_FLAG'   // Can't submit own flag
  | 'INVALID';   // Flag doesn't exist

interface FlagSubmissionResult {
  status: SubmissionStatus;
  points?: number;
  message: string;
}
```

---

## 👥 User Roles & Permissions

### Role Matrix

| Feature                | TEAM | TEACHER | ADMIN |
|------------------------|:----:|:-------:|:-----:|
| Login / Logout         | ✅   | ✅      | ✅    |
| View Scoreboard        | ✅   | ✅      | ✅    |
| View Own Profile       | ✅   | ✅      | ✅    |
| View All Teams (list)  | ✅   | ✅      | ✅    |
| Create Team            | ❌   | ✅      | ✅    |
| Update Team            | ❌   | ✅      | ✅    |
| Delete Team            | ❌   | ✅      | ✅    |
| Bulk Import Teams      | ❌   | ✅      | ✅    |
| Upload Checker         | ❌   | ✅      | ✅    |
| Upload VulnBox         | ❌   | ✅      | ✅    |
| Start Game             | ❌   | ✅      | ✅    |
| Stop Game              | ❌   | ✅      | ✅    |
| View Game Status       | ❌   | ✅      | ✅    |

### Route Protection Logic

```typescript
// Route guard example
const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Usage
<Route path="/admin/*" element={
  <ProtectedRoute requiredRoles={['ADMIN', 'TEACHER']}>
    <AdminPanel />
  </ProtectedRoute>
} />
```

---

## 📄 Page Structure

### Page Breakdown

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PAGE STRUCTURE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PUBLIC PAGES (No Auth)                                              │
│  ├── /login              → Login page with cyberpunk theme           │
│  ├── /signup             → Team registration form                    │
│  └── /scoreboard         → Live public scoreboard                    │
│                                                                      │
│  TEAM PAGES (Auth Required)                                          │
│  ├── /dashboard          → Team dashboard/overview                   │
│  ├── /profile            → View/edit team profile                    │
│  └── /game               → Game view (when participating)            │
│                                                                      │
│  ADMIN PAGES (ADMIN/TEACHER Role)                                    │
│  ├── /admin              → Admin dashboard overview                  │
│  ├── /admin/teams        → Team management (CRUD)                    │
│  ├── /admin/teams/new    → Create new team form                      │
│  ├── /admin/teams/import → Bulk import from CSV                      │
│  ├── /admin/game         → Game control panel                        │
│  ├── /admin/game/status  → Live game monitoring                      │
│  ├── /admin/upload       → Upload checker/vulnbox files              │
│  └── /admin/settings     → System settings                           │
│                                                                      │
│  ERROR PAGES                                                         │
│  ├── /404                → Not found                                 │
│  └── /unauthorized       → Access denied                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Page Wireframes

#### Login Page
```
┌─────────────────────────────────────────────────────────────┐
│                     ATK-DEF CTF PLATFORM                     │
│                   =====================                      │
│                                                             │
│           ┌──────────────────────────────────┐              │
│           │  🔐 SYSTEM ACCESS TERMINAL       │              │
│           ├──────────────────────────────────┤              │
│           │                                  │              │
│           │  Username:                       │              │
│           │  ┌────────────────────────────┐  │              │
│           │  │ admin                      │  │              │
│           │  └────────────────────────────┘  │              │
│           │                                  │              │
│           │  Password:                       │              │
│           │  ┌────────────────────────────┐  │              │
│           │  │ ••••••••                   │  │              │
│           │  └────────────────────────────┘  │              │
│           │                                  │              │
│           │  ┌────────────────────────────┐  │              │
│           │  │     >> AUTHENTICATE <<     │  │              │
│           │  └────────────────────────────┘  │              │
│           │                                  │              │
│           │  Don't have access? [Register]   │              │
│           └──────────────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Scoreboard Page
```
┌─────────────────────────────────────────────────────────────────────┐
│ ⚔️ ATK-DEF CTF SCOREBOARD                    [Tick: 42] [⏱ 00:45]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│            ┌─────────┐                                               │
│         ┌──│ 🥇 #1   │──┐                                            │
│         │  │ Team A  │  │     TOP 3 PODIUM                           │
│      ┌──│  │ 1,500   │  │──┐                                         │
│      │  │  └─────────┘  │  │                                         │
│   ┌──│  │               │  │──┐                                      │
│   │🥈│  │               │  │🥉│                                      │
│   │#2│  │               │  │#3│                                      │
│   │  │  │               │  │  │                                      │
│   └──┴──┴───────────────┴──┴──┘                                      │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ #  │ Team        │ Attack │ Defense │ SLA  │ Total  │ Status │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 1  │ Team Alpha  │  800   │   500   │ 200  │ 1,500  │  🟢 UP │  │
│  │ 2  │ Team Beta   │  750   │   450   │ 180  │ 1,380  │  🟢 UP │  │
│  │ 3  │ Team Gamma  │  600   │   400   │ 150  │ 1,150  │  🔴 DN │  │
│  │ 4  │ Team Delta  │  500   │   350   │ 140  │   990  │  🟢 UP │  │
│  │ ...│ ...         │  ...   │   ...   │ ...  │   ...  │  ...   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [🔄 Auto-refresh: ON]        Last updated: 2024-12-31 00:15:32     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Admin Dashboard
```
┌─────────────────────────────────────────────────────────────────────┐
│ ⚙️ ADMIN CONTROL PANEL                              [admin] [Logout]│
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                     │
│  📊 Dashboard  │   ┌─────────────────┐  ┌─────────────────┐         │
│  👥 Teams      │   │  GAME STATUS    │  │  ACTIVE TEAMS   │         │
│  🎮 Game       │   │  ───────────    │  │  ───────────    │         │
│  📤 Uploads    │   │  🟢 RUNNING     │  │      15         │         │
│  ⚙️ Settings   │   │  Tick: 42/100   │  │   participating │         │
│                │   └─────────────────┘  └─────────────────┘         │
│                │                                                     │
│                │   ┌─────────────────┐  ┌─────────────────┐         │
│                │   │  FLAGS TODAY    │  │  TOTAL FLAGS    │         │
│                │   │  ───────────    │  │  ───────────    │         │
│                │   │     2,450       │  │    156,230      │         │
│                │   │   submitted     │  │    generated    │         │
│                │   └─────────────────┘  └─────────────────┘         │
│                │                                                     │
│                │   ┌───────────────────────────────────────────┐    │
│                │   │            QUICK ACTIONS                  │    │
│                │   ├───────────────────────────────────────────┤    │
│                │   │  [➕ Add Team]  [📤 Import CSV]           │    │
│                │   │  [▶️ Start Game] [⏹️ Stop Game]           │    │
│                │   └───────────────────────────────────────────┘    │
│                │                                                     │
└────────────────┴────────────────────────────────────────────────────┘
```

---

## 🧩 Component Architecture

### Core Components

```typescript
// ================== LAYOUT COMPONENTS ==================

interface NavbarProps {
  user?: User;
  onLogout: () => void;
}

interface SidebarProps {
  items: MenuItem[];
  activeItem: string;
}

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  showSidebar?: boolean;
}

// ================== AUTH COMPONENTS ==================

interface LoginFormProps {
  onSubmit: (credentials: LoginRequest) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

interface SignupFormProps {
  onSubmit: (data: SignupRequest) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

// ================== TEAM COMPONENTS ==================

interface TeamCardProps {
  team: Team;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
}

interface TeamTableProps {
  teams: Team[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface TeamFormProps {
  initialData?: Partial<Team>;
  onSubmit: (data: CreateTeamRequest | UpdateTeamRequest) => Promise<void>;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

interface CsvImportProps {
  onUpload: (file: File) => Promise<BulkImportResponse>;
  isLoading: boolean;
}

// ================== SCOREBOARD COMPONENTS ==================

interface ScoreboardTableProps {
  teams: ScoreboardTeam[];
  currentTick: number;
  highlightTeamId?: number;
}

interface RankPodiumProps {
  top3: ScoreboardTeam[];
}

interface TeamRankRowProps {
  team: ScoreboardTeam;
  isCurrentTeam?: boolean;
}

interface LiveTickerProps {
  currentTick: number;
  totalTicks: number;
  tickDuration: number;
}

// ================== GAME COMPONENTS ==================

interface GameStatusCardProps {
  status: GameStatus;
  currentTick: number;
  startTime?: string;
}

interface GameControlPanelProps {
  gameStatus: GameStatus;
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;
  isLoading: boolean;
}

// ================== UPLOAD COMPONENTS ==================

interface FileUploaderProps {
  accept: string;          // '.py' or '.zip'
  onUpload: (file: File, challengeId: number) => Promise<UploadResponse>;
  uploadType: 'checker' | 'vulnbox';
}

// ================== COMMON COMPONENTS ==================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
```

---

## 🗄️ State Management

### Recommended State Structure

```typescript
// Using Zustand (recommended) or Redux Toolkit

// ================= AUTH STORE =================
interface AuthStore {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
}

// ================= TEAM STORE =================
interface TeamStore {
  // State
  teams: Team[];
  selectedTeam: Team | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTeams: () => Promise<void>;
  createTeam: (data: CreateTeamRequest) => Promise<TeamCreatedWithCredentials>;
  updateTeam: (id: number, data: UpdateTeamRequest) => Promise<void>;
  deleteTeam: (id: number) => Promise<void>;
  importTeams: (file: File) => Promise<BulkImportResponse>;
  selectTeam: (team: Team | null) => void;
}

// ================= GAME STORE =================
interface GameStore {
  // State
  currentGame: Game | null;
  status: GameStatus | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchGameStatus: () => Promise<void>;
  startGame: () => Promise<void>;
  stopGame: () => Promise<void>;
}

// ================= SCOREBOARD STORE =================
interface ScoreboardStore {
  // State
  scoreboard: Scoreboard | null;
  isLoading: boolean;
  error: string | null;
  autoRefresh: boolean;
  refreshInterval: number; // milliseconds
  
  // Actions
  fetchScoreboard: () => Promise<void>;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (ms: number) => void;
}
```

### Example Zustand Store Implementation

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: {
              id: response.id,
              username: response.username,
              teamName: response.teamName,
              role: response.roles[0]?.replace('ROLE_', '') as UserRole,
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false,
            isAuthenticated: false 
          });
          throw error;
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      fetchCurrentUser: async () => {
        const token = get().token;
        if (!token) return;
        
        set({ isLoading: true });
        try {
          const user = await authService.getMe(token);
          set({ user, isLoading: false });
        } catch {
          get().logout();
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

---

## 🔐 Authentication Flow

### Complete Auth Implementation

```typescript
// services/authService.ts
const API_URL = 'http://localhost:8080/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },
  
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }
    
    return response.json();
  },
  
  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Session expired');
    }
    
    return response.json();
  },
};

// hooks/useAuth.ts
export const useAuth = () => {
  const store = useAuthStore();
  
  const isAdmin = store.user?.role === 'ADMIN';
  const isTeacher = store.user?.role === 'TEACHER';
  const isTeam = store.user?.role === 'TEAM';
  const canManage = isAdmin || isTeacher;
  
  return {
    ...store,
    isAdmin,
    isTeacher,
    isTeam,
    canManage,
  };
};
```

### Axios Interceptor for Auto-Auth

```typescript
// lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## ⚡ Real-time Features

### Scoreboard Auto-Refresh

```typescript
// hooks/useScoreboard.ts
import { useEffect, useCallback } from 'react';
import { useScoreboardStore } from '../stores/scoreboardStore';

export const useScoreboard = (autoRefreshMs = 10000) => {
  const {
    scoreboard,
    isLoading,
    fetchScoreboard,
    autoRefresh,
  } = useScoreboardStore();
  
  // Initial fetch
  useEffect(() => {
    fetchScoreboard();
  }, []);
  
  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchScoreboard();
    }, autoRefreshMs);
    
    return () => clearInterval(interval);
  }, [autoRefresh, autoRefreshMs]);
  
  return {
    scoreboard,
    isLoading,
    refresh: fetchScoreboard,
  };
};
```

### Future: WebSocket for Real-time Updates

```typescript
// For future implementation with WebSocket
// services/websocket.ts
class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  
  connect(gameId: string) {
    this.socket = new WebSocket(`ws://localhost:8080/ws/game/${gameId}`);
    
    this.socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      this.emit(type, data);
    };
  }
  
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }
  
  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

// Usage
const ws = new WebSocketService();
ws.connect('game-123');
ws.on('scoreboard_update', (data) => {
  updateScoreboard(data);
});
ws.on('tick_change', (tick) => {
  setCurrentTick(tick);
});
```

---

## 🛠️ Recommended Tech Stack

### Primary Stack (Recommended)

| Category | Technology | Reason |
|----------|------------|--------|
| **Framework** | React 18 + Vite | Fast dev server, modern React |
| **Routing** | React Router v6 | Standard, well-documented |
| **State** | Zustand | Simple, no boilerplate |
| **HTTP** | Axios | Interceptors, better DX |
| **Styling** | TailwindCSS or Vanilla CSS | Rapid styling |
| **Forms** | React Hook Form | Performance, validation |
| **Icons** | Lucide React | Modern, tree-shakeable |
| **Animations** | Framer Motion | Smooth, declarative |
| **Tables** | TanStack Table | Feature-rich, headless |
| **Notifications** | React Hot Toast | Beautiful, easy |

### Alternative Stack

| Category | Alternative |
|----------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **State** | Redux Toolkit / Jotai |
| **Styling** | Chakra UI / shadcn/ui |
| **Forms** | Formik |

---

## 📁 Recommended Project Structure

```
src/
├── app/                          # App-level setup
│   ├── App.tsx                   # Root component
│   ├── Router.tsx                # Route definitions
│   └── providers/                # Context providers
│       ├── AuthProvider.tsx
│       └── ThemeProvider.tsx
│
├── components/                   # Reusable components
│   ├── common/                   # Generic UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.css
│   │   ├── Modal/
│   │   ├── Card/
│   │   ├── Table/
│   │   ├── Input/
│   │   ├── Loading/
│   │   └── Toast/
│   │
│   ├── layout/                   # Layout components
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   └── PageLayout/
│   │
│   ├── auth/                     # Auth-related components
│   │   ├── LoginForm/
│   │   ├── SignupForm/
│   │   └── ProtectedRoute/
│   │
│   ├── team/                     # Team-related components
│   │   ├── TeamCard/
│   │   ├── TeamTable/
│   │   ├── TeamForm/
│   │   └── CsvImport/
│   │
│   ├── scoreboard/               # Scoreboard components
│   │   ├── ScoreboardTable/
│   │   ├── RankPodium/
│   │   ├── TeamRankRow/
│   │   └── LiveTicker/
│   │
│   └── game/                     # Game-related components
│       ├── GameStatus/
│       ├── GameControl/
│       └── FileUploader/
│
├── pages/                        # Page components
│   ├── public/
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── ScoreboardPage.tsx
│   │
│   ├── team/
│   │   ├── DashboardPage.tsx
│   │   └── ProfilePage.tsx
│   │
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── TeamManagement.tsx
│   │   ├── CreateTeamPage.tsx
│   │   ├── ImportTeamsPage.tsx
│   │   ├── GameControlPage.tsx
│   │   └── UploadPage.tsx
│   │
│   └── error/
│       ├── NotFoundPage.tsx
│       └── UnauthorizedPage.tsx
│
├── services/                     # API services
│   ├── api.ts                    # Axios instance
│   ├── authService.ts
│   ├── teamService.ts
│   ├── gameService.ts
│   └── scoreboardService.ts
│
├── stores/                       # State stores (Zustand)
│   ├── authStore.ts
│   ├── teamStore.ts
│   ├── gameStore.ts
│   └── scoreboardStore.ts
│
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useTeams.ts
│   ├── useGame.ts
│   ├── useScoreboard.ts
│   └── useAutoRefresh.ts
│
├── types/                        # TypeScript types
│   ├── auth.types.ts
│   ├── team.types.ts
│   ├── game.types.ts
│   ├── scoreboard.types.ts
│   └── api.types.ts
│
├── utils/                        # Utilities
│   ├── formatters.ts             # Date, number formatters
│   ├── validators.ts             # Form validation
│   ├── constants.ts              # App constants
│   └── helpers.ts                # Misc helpers
│
├── styles/                       # Global styles
│   ├── globals.css
│   ├── variables.css
│   └── animations.css
│
├── assets/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── config/                       # Configuration
    ├── routes.ts                 # Route constants
    └── api.config.ts             # API config
```

---

## 🎨 Design System Recommendations

### Color Palette (Cyberpunk Theme)

```css
:root {
  /* Primary Colors */
  --color-primary: #00f0ff;        /* Cyan */
  --color-primary-dark: #0099aa;
  --color-primary-light: #66f7ff;
  
  /* Secondary Colors */
  --color-secondary: #ff00ff;      /* Magenta */
  --color-accent: #ffff00;         /* Yellow */
  
  /* Status Colors */
  --color-success: #00ff88;
  --color-warning: #ffaa00;
  --color-error: #ff4444;
  --color-info: #00aaff;
  
  /* Backgrounds */
  --bg-dark: #0a0a0f;
  --bg-card: #12121a;
  --bg-elevated: #1a1a2e;
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a0a0b0;
  --text-muted: #606070;
  
  /* Borders */
  --border-color: rgba(0, 240, 255, 0.2);
  --border-glow: 0 0 10px rgba(0, 240, 255, 0.3);
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-display: 'Orbitron', sans-serif;  /* For headings */
  --font-mono: 'JetBrains Mono', monospace; /* For code/data */
  --font-body: 'Inter', sans-serif;         /* For body text */
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 2rem;      /* 32px */
  --text-4xl: 2.5rem;    /* 40px */
}
```

---

## 🚀 Quick Start Commands

```bash
# Create new React + Vite project
npx create-vite@latest ctf-frontend --template react-ts
cd ctf-frontend

# Install dependencies
npm install axios zustand react-router-dom react-hook-form
npm install @tanstack/react-table framer-motion lucide-react
npm install react-hot-toast

# Dev dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start development
npm run dev
```

---

## 📝 Summary

This architecture document provides:

1. **Complete API Reference** - All endpoints with request/response types
2. **Data Models** - TypeScript interfaces for all entities
3. **Role-based Access** - Permission matrix for all features
4. **Page Structure** - Complete navigation and page breakdown
5. **Component Architecture** - Reusable component specifications
6. **State Management** - Zustand store implementations
7. **Authentication Flow** - Complete auth implementation
8. **Real-time Features** - Auto-refresh and WebSocket patterns
9. **Tech Stack** - Recommended technologies
10. **Project Structure** - Organized folder layout

Use this as your reference while building the frontend. Good luck! 🚀
