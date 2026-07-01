import type { SafeUser } from '../types/user';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// ========== Token 管理 ==========

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// ========== 用户信息管理 ==========

export const getCurrentUser = (): SafeUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SafeUser;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: SafeUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// ========== 便捷方法 ==========

export const isLoggedIn = (): boolean => {
  return getToken() !== null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user !== null && user.role === 'ADMIN';
};

export const isStudent = (): boolean => {
  const user = getCurrentUser();
  return user !== null && user.role === 'STUDENT';
};

export const logout = (): void => {
  clearToken();
  clearCurrentUser();
};
