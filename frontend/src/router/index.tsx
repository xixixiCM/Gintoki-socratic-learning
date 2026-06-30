import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import { Home } from '../pages/Home';
import { Graph } from '../pages/Graph';
import Chat from '../pages/Chat';

const Layout = (): JSX.Element => {
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-gradient-to-r from-slate-900/70 to-slate-800/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-base font-semibold tracking-wide text-white">
            AI 苏格拉底学习系统
          </Link>
          <nav className="flex items-center gap-3 text-sm">
  <Link
    to="/"
    className={`rounded-full px-4 py-2 transition ${
      location.pathname === '/' ? 'bg-white text-slate-950' : 'text-slate-200 hover:bg-white/10'
    }`}
  >
    首页
  </Link>
  <Link
    to="/graph"
    className={`rounded-full px-4 py-2 transition ${
      location.pathname === '/graph' ? 'bg-cyan-400 text-slate-950' : 'text-slate-200 hover:bg-white/10'
    }`}
  >
    知识图谱
  </Link>
  <Link
    to="/chat"
    className={`rounded-full px-4 py-2 transition ${
      location.pathname === '/chat' ? 'bg-cyan-400 text-slate-950' : 'text-slate-200 hover:bg-white/10'
    }`}
  >
    AI对话
  </Link>
</nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export const AppRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/graph" element={<Graph />} />，
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
