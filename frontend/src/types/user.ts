export type UserRole = 'STUDENT' | 'ADMIN';

export type UserStatus = 'active' | 'disabled';

export interface SafeUser {
  id: number;
  username: string;
  nickname: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
  user: SafeUser;
}

export interface AdminDashboard {
  totalUserCount: number;
  studentCount: number;
  adminCount: number;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResult {
  id: number;
  username: string;
  nickname: string | null;
  role: 'STUDENT';
  status: 'active';
  createdAt: string;
}

export interface AdminUserQuery {
  keyword?: string;
  role?: UserRole | '';
  status?: UserStatus | '';
}
