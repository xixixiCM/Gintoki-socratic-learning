import { useCallback, useEffect, useState } from 'react';
import { getAdminUsersApi } from '../../api/admin';
import type { SafeUser, UserRole, UserStatus } from '../../types/user';

export const AdminUsersPage = (): JSX.Element => {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 筛选条件
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [status, setStatus] = useState<UserStatus | ''>('');

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAdminUsersApi({
        keyword: keyword || undefined,
        role: role || undefined,
        status: status || undefined
      });
      setUsers(result);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? '加载用户列表失败');
    } finally {
      setLoading(false);
    }
  }, [keyword, role, status]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // 角色标签样式
  const roleBadge = (r: UserRole) => {
    if (r === 'ADMIN') {
      return <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">管理员</span>;
    }
    return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">普通用户</span>;
  };

  // 状态标签样式
  const statusBadge = (s: UserStatus) => {
    if (s === 'disabled') {
      return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">已禁用</span>;
    }
    return <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">正常</span>;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">用户信息管理</h2>
      <p className="mt-1 text-sm text-slate-500">查看和筛选系统用户基础信息</p>

      {/* 筛选栏 */}
      <div className="mt-6 flex flex-wrap items-end gap-4">
        {/* 搜索框 */}
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-medium text-slate-600">搜索</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="用户名 / 昵称"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* 角色筛选 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">角色</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole | '')}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">全部</option>
            <option value="STUDENT">普通用户</option>
            <option value="ADMIN">管理员</option>
          </select>
        </div>

        {/* 状态筛选 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">状态</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus | '')}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">全部</option>
            <option value="active">正常</option>
            <option value="disabled">已禁用</option>
          </select>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-6 py-4 text-sm text-red-600">{error}</div>
      )}

      {/* 加载中 */}
      {loading && (
        <div className="mt-8 text-center text-slate-400">加载中...</div>
      )}

      {/* 用户表格 */}
      {!loading && !error && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-slate-600">用户ID</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">用户名</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">昵称</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">角色</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">状态</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">注册时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    暂无用户数据
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">{user.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{user.username}</td>
                    <td className="px-6 py-4 text-slate-600">{user.nickname ?? '-'}</td>
                    <td className="px-6 py-4">{roleBadge(user.role)}</td>
                    <td className="px-6 py-4">{statusBadge(user.status)}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleString('zh-CN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
