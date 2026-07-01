import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboardApi } from '../../api/admin';
import type { AdminDashboard } from '../../types/user';

export const AdminDashboardPage = (): JSX.Element => {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await getAdminDashboardApi();
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? '加载后台概览失败');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">管理员后台</h2>
      <p className="mt-1 text-sm text-slate-500">系统用户基础信息概览</p>

      {loading ? (
        <div className="mt-8 text-center text-slate-400">加载中...</div>
      ) : error ? (
        <div className="mt-8 rounded-xl bg-red-50 px-6 py-4 text-sm text-red-600">{error}</div>
      ) : data ? (
        <>
          {/* 统计卡片 */}
          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">总用户数</p>
              <p className="mt-2 text-3xl font-bold text-slate-800">{data.totalUserCount}</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm">
              <p className="text-sm text-blue-600">普通用户</p>
              <p className="mt-2 text-3xl font-bold text-blue-700">{data.studentCount}</p>
            </div>
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6 shadow-sm">
              <p className="text-sm text-purple-600">管理员</p>
              <p className="mt-2 text-3xl font-bold text-purple-700">{data.adminCount}</p>
            </div>
          </div>

          {/* 快捷入口 */}
          <div className="mt-8">
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              进入用户信息管理 →
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
};
