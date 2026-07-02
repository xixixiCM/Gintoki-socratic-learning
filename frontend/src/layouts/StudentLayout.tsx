import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout as doLogout, getCurrentUser } from '../store/authStore';

export const StudentLayout = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const isActive = (path: string) =>
    location.pathname === path
      ? 'bg-shelf-ink text-shelf-panel'
      : 'text-shelf-muted hover:bg-shelf-bg';

  const handleLogout = () => {
    doLogout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-shelf-line/90 bg-shelf-panel/80 backdrop-blur shadow-shelf-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/home" className="text-base font-semibold tracking-wide text-shelf-ink">
            AI 苏格拉底学习系统
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              to="/home"
              className={`rounded-full px-4 py-2 transition ${isActive('/home')}`}
            >
              教材书架
            </Link>
            <span className="mx-1 text-shelf-muted">|</span>
            <span className="text-xs text-shelf-muted">
              {user?.nickname ?? user?.username ?? ''}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-full px-4 py-2 text-shelf-muted transition hover:bg-red-50 hover:text-red-600"
            >
              退出登录
            </button>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};
