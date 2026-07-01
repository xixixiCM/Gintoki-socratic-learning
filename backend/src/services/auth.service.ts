import { findUserByUsername, findUserById, createStudentUser } from '../repositories/user.repository';
import { generateToken } from '../utils/jwt';
import type { LoginResult, SafeUser, UserRow, RegisterResult } from '../types/user.types';

const toSafeUser = (row: UserRow): SafeUser => ({
  id: row.id,
  username: row.username,
  nickname: row.nickname,
  role: row.role,
  status: row.status,
  createdAt: row.create_time instanceof Date
    ? row.create_time.toISOString()
    : String(row.create_time),
  updatedAt: row.update_time instanceof Date
    ? row.update_time.toISOString()
    : String(row.update_time)
});

/**
 * 用户登录
 * 正式项目 password 应使用 bcrypt.compare 比较哈希值
 */
export const login = async (username: string, password: string): Promise<LoginResult> => {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new LoginError('用户名或密码错误');
  }

  if (user.status !== 'active') {
    throw new LoginError('账号已被禁用，请联系管理员');
  }

  // 基础版：明文密码比较，正式项目改为 bcrypt.compare(password, user.password)
  if (user.password !== password) {
    throw new LoginError('用户名或密码错误');
  }

  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role
  });

  return {
    token,
    user: toSafeUser(user)
  };
};

/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = async (userId: number): Promise<SafeUser> => {
  const user = await findUserById(userId);

  if (!user) {
    throw new LoginError('用户不存在');
  }

  return toSafeUser(user);
};

/**
 * 用户注册
 * 课程实训演示版暂时使用明文密码；正式项目应使用 bcrypt 哈希加密
 */
export const register = async (username: string, password: string): Promise<RegisterResult> => {
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  if (!trimmedUsername) {
    throw new RegisterError('用户名不能为空');
  }

  if (!trimmedPassword) {
    throw new RegisterError('密码不能为空');
  }

  if (trimmedUsername.length > 50) {
    throw new RegisterError('用户名不能超过50个字符');
  }

  if (trimmedPassword.length > 100) {
    throw new RegisterError('密码不能超过100个字符');
  }

  // 检查用户名是否已存在
  const existingUser = await findUserByUsername(trimmedUsername);
  if (existingUser) {
    throw new RegisterError('用户名已存在，请换一个');
  }

  // 创建普通学生用户（role 固定 STUDENT，status 固定 active）
  const safeUser = await createStudentUser(trimmedUsername, trimmedPassword);

  return {
    id: safeUser.id,
    username: safeUser.username,
    nickname: safeUser.nickname,
    role: 'STUDENT' as const,
    status: 'active' as const,
    createdAt: safeUser.createdAt
  };
};

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
  }
}

export class RegisterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RegisterError';
  }
}
