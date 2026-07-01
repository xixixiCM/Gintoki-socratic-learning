import { pool } from '../db/pool';
import type { UserRow, SafeUser, AdminUserQuery } from '../types/user.types';

/**
 * 将数据库行转为前端安全用户对象（去除 password）
 */
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
 * 根据用户名查找用户（包含 password，用于登录校验）
 */
export const findUserByUsername = async (username: string): Promise<UserRow | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT id, username, password, nickname, role, status, create_time, update_time FROM user WHERE username = ? LIMIT 1',
      [username]
    );
    if (rows.length === 0) return null;
    return rows[0] as UserRow;
  } finally {
    connection.release();
  }
};

/**
 * 根据用户 ID 查找用户（包含 password）
 */
export const findUserById = async (id: number): Promise<UserRow | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT id, username, password, nickname, role, status, create_time, update_time FROM user WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) return null;
    return rows[0] as UserRow;
  } finally {
    connection.release();
  }
};

/**
 * 管理员查询用户列表（不含 password），支持 keyword/role/status 筛选
 */
export const findUsers = async (query: AdminUserQuery): Promise<SafeUser[]> => {
  const connection = await pool.getConnection();
  try {
    const conditions: string[] = [];
    const params: any[] = [];

    if (query.keyword) {
      conditions.push('(username LIKE ? OR nickname LIKE ?)');
      const kw = `%${query.keyword}%`;
      params.push(kw, kw);
    }

    if (query.role) {
      conditions.push('role = ?');
      params.push(query.role);
    }

    if (query.status) {
      conditions.push('status = ?');
      params.push(query.status);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await connection.query<any[]>(
      `SELECT id, username, nickname, role, status, create_time, update_time FROM user ${where} ORDER BY id ASC`,
      params
    );

    return rows.map((row) => toSafeUser(row as UserRow));
  } finally {
    connection.release();
  }
};

/**
 * 统计用户总数
 */
export const countUsers = async (): Promise<number> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT COUNT(*) AS cnt FROM user'
    );
    return rows[0].cnt as number;
  } finally {
    connection.release();
  }
};

/**
 * 创建普通学生用户
 * 课程实训演示版明文存储密码；正式项目应使用 bcrypt 哈希
 */
export const createStudentUser = async (username: string, password: string, nickname?: string): Promise<SafeUser> => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<any>(
      'INSERT INTO user (username, password, nickname, role, status) VALUES (?, ?, ?, \'STUDENT\', \'active\')',
      [username, password, nickname ?? username]
    );

    const insertId = result.insertId as number;

    const [rows] = await connection.query<any[]>(
      'SELECT id, username, nickname, role, status, create_time, update_time FROM user WHERE id = ? LIMIT 1',
      [insertId]
    );

    return toSafeUser(rows[0] as UserRow);
  } finally {
    connection.release();
  }
};

/**
 * 按角色统计用户数
 */
export const countUsersByRole = async (role: 'STUDENT' | 'ADMIN'): Promise<number> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT COUNT(*) AS cnt FROM user WHERE role = ?',
      [role]
    );
    return rows[0].cnt as number;
  } finally {
    connection.release();
  }
};
