import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { Home } from '../pages/Home';
import { Graph } from '../pages/Graph';
import { Classroom } from '../pages/Classroom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { AdminDashboardPage } from '../pages/admin/AdminDashboard';
import { AdminUsersPage } from '../pages/admin/AdminUsers';
import { StudentLayout } from '../layouts/StudentLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { isLoggedIn, isAdmin } from '../store/authStore';

// ========== 路由守卫 ==========

/** 需要登录才能访问，未登录跳转 /login */
const RequireAuth = (): JSX.Element => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

/** 仅管理员可访问，非管理员跳转 /home */
const RequireAdmin = (): JSX.Element => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
};

/** 已登录用户访问 /login 时根据角色跳转 */
const RedirectIfLoggedIn = (): JSX.Element => {
  if (isLoggedIn()) {
    if (isAdmin()) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }
  return <Login />;
};

// ========== 路由配置 ==========

export const AppRouter = (): JSX.Element => {
  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/login" element={<RedirectIfLoggedIn />} />
      <Route path="/register" element={<Register />} />

      {/* 学生端路由（Admin 也可访问） */}
      <Route element={<RequireAuth />}>
        <Route element={<StudentLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/graph" element={<Graph />} />
        </Route>
      </Route>

      {/* 管理员路由 */}
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      {/* 默认跳转 */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
