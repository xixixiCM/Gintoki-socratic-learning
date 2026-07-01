export type UserRole = 'STUDENT' | 'ADMIN';

export type UserStatus = 'active' | 'disabled';

export interface UserRow {
  id: number;
  username: string;
  password: string;
  nickname: string | null;
  role: UserRole;
  status: UserStatus;
  create_time: Date;
  update_time: Date;
}

/** 返回给前端的用户对象，不包含 password */
export interface SafeUser {
  id: number;
  username: string;
  nickname: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginResult {
  token: string;
  user: SafeUser;
}

export interface RegisterInput {
  username: string;
  password: string;
}

/** 注册成功返回（不含 password） */
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
  role?: UserRole;
  status?: UserStatus;
}
