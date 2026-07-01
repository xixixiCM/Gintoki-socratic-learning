import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/auth';
import { setToken, setCurrentUser } from '../store/authStore';

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    setLoading(true);
    try {
      const result = await loginApi(username.trim(), password);
      setToken(result.token);
      setCurrentUser(result.user);

      // 根据角色跳转
      if (result.user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } catch (err: any) {
      const message = err?.response?.data?.message ?? '登录失败，请检查用户名和密码';
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
          <p className="mt-2 text-sm text-slate-500">请登录以继续</p>
        </div>

        {/* 登录卡片 */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-lg backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">
                用户名
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-800 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          {/* 注册入口 */}
          <div className="mt-4 text-center">
            <span className="text-sm text-slate-500">还没有账号？</span>
            <Link
              to="/register"
              className="ml-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
            >
              去注册
            </Link>
          </div>

          {/* 测试账号提示 */}
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
            <p className="text-xs font-medium text-blue-800">测试账号</p>
            <div className="mt-1.5 space-y-0.5 text-xs text-blue-600">
              <p>普通用户：student / 123456</p>
              <p>管理员：admin / 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
