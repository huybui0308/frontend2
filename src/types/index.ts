// ================= USER & AUTH =================

export interface User {
  id: number;
  username: string;
  teamName: string;
  role: UserRole;
  token?: string;
}

export type UserRole = 'ADMIN' | 'TEACHER' | 'TEAM';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: "Bearer";
  id: number;
  username: string;
  teamName: string;
  roles: string[];
}

export interface SignupRequest {
  username: string;
  password: string;
  teamName: string;
  country?: string;
  affiliation?: string;
}

export interface SignupResponse {
  message: string;
  teamId: number;
}

// ================= TEAM =================

export interface Team {
  id: number;
  username?: string;
  name: string;
  affiliation?: string;
  country?: string;
  ipAddress?: string;
  createdAt?: string;
}

export interface CreateTeamRequest {
  name: string;
  country?: string;
  affiliation?: string;
  ipAddress?: string;
  studentCount?: number;
}

export interface TeamCreatedResponse {
  success: boolean;
  id: number;
  name: string;
  username: string;
  defaultPassword: string;
  students?: Array<{
    username: string;
    password: string;
    boxIp: string;
    sshPort: number;
  }>;
}

export interface UpdateTeamRequest {
  name?: string;
  country?: string;
  affiliation?: string;
  ipAddress?: string;
}

export interface BulkImportResponse {
  success: boolean;
  imported_count: number;
  teams: Array<{
    id: number;
    name: string;
    username: string;
    password: string;
  }>;
}

// ================= GAME =================

export type GameStatus = 'DRAFT' | 'DEPLOYING' | 'RUNNING' | 'PAUSED' | 'FINISHED';

export interface Game {
  id: string;
  name: string;
  description?: string;
  vulnboxPath?: string;
  checkerModule?: string;
  status: GameStatus;
  current_tick: number;
  tick_duration_seconds: number;
  start_time?: string;
  end_time?: string;
  createdAt?: string;
}

export interface GameStartResponse {
  success: boolean;
  message: string;
  game_id: string;
}

export interface GameStopResponse {
  success: boolean;
  message: string;
}

// ================= SCOREBOARD =================

export interface ScoreboardTeam {
  team_id: number | string;
  name: string;
  rank: number;
  score: number;
  attack_points: number;
  defense_points: number;
  sla_points: number;
  flags_captured: number;
  flags_lost: number;
}

export interface Scoreboard {
  game_id: string;
  current_tick: number;
  teams: ScoreboardTeam[];
  lastUpdated?: string;
}

// ================= CHALLENGE/SERVICE =================

export interface Challenge {
  id: string;
  name: string;
  description: string;
  category: string;
  points: number;
}

export type ServiceStatusType = 'UP' | 'DOWN' | 'MUMBLE' | 'CORRUPT';

export interface ServiceStatus {
  serviceId: string;
  serviceName: string;
  status: ServiceStatusType;
  lastCheck: string;
  slaPercentage: number;
}

export interface ChallengeCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
  sshCommand: string;
}

// ================= UPLOAD =================

export interface UploadResponse {
  success: boolean;
  filename: string;
  path: string;
  challengeId?: number;
}

// ================= FLAG SUBMISSION =================

export type SubmissionStatus = 
  | 'ACCEPTED'
  | 'REJECTED'
  | 'DUPLICATE'
  | 'EXPIRED'
  | 'OWN_FLAG'
  | 'INVALID';

export interface FlagSubmissionResult {
  status: SubmissionStatus;
  points?: number;
  message: string;
}
