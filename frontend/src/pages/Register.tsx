import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../api/auth';

export const Register = (): JSX.Element => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim()) {
      setError('请输入名字');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    setLoading(true);
    try {
      await registerApi(username.trim(), password);
      setSuccess('注册成功！即将跳转到登录页...');
      // 1.5 秒后跳转登录页
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? '注册失败，请稍后重试';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        {/* 标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-wide text-slate-800">
            AI 虚拟人物苏格拉底式学习系统
          </h1>
          <p className="mt-2 text-sm text-slate-500">普通用户注册</p>
        </div>

        {/* 注册卡片 */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-lg backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 名字（用户名） */}
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">
                名字
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入名字（即登录用户名）"
                disabled={success !== null}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              />
            </div>

            {/* 密码 */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                密码
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                disabled={success !== null}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 成功提示 */}
            {success && (
              <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={loading || success !== null}
              className="w-full rounded-xl bg-slate-800 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '注册中...' : '注 册'}
            </button>
          </form>

          {/* 返回登录 */}
          <div className="mt-4 text-center">
            <span className="text-sm text-slate-500">已有账号？</span>
            <Link
              to="/login"
              className="ml-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
            >
              去登录
            </Link>
          </div>

          {/* 提示 */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">
              注册后将自动成为普通学习者（STUDENT），可以学习课程内容。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
