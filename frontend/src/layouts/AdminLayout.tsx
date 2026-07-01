import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout as doLogout, getCurrentUser } from '../store/authStore';

export const AdminLayout = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    doLogout();
    navigate('/login', { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? 'bg-slate-800 text-white'
      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white';

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* 侧边栏 */}
      <aside className="flex w-60 flex-col bg-slate-900 text-white">
        {/* Logo */}
        <div className="border-b border-slate-700 px-6 py-5">
          <h1 className="text-base font-bold tracking-wide">管理员后台</h1>
          <p className="mt-1 text-xs text-slate-400">
            {user?.nickname ?? user?.username ?? '管理员'}
          </p>
        </div>

        {/* 导航 */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          <Link
            to="/admin"
            className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${isActive('/admin')}`}
          >
            管理员首页
          </Link>
          <Link
            to="/admin/users"
            className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${isActive('/admin/users')}`}
          >
            用户信息管理
          </Link>
        </nav>

        {/* 退出 */}
        <div className="border-t border-slate-700 px-3 py-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-2.5 text-left text-sm text-slate-400 transition hover:bg-red-900/30 hover:text-red-300"
          >
            退出登录
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
