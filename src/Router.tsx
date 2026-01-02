import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import type { UserRole } from './types';

// Public pages
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import ScoreboardPage from './pages/public/ScoreboardPage';

// Team pages
import DashboardPage from './pages/team/DashboardPage';
import ProfilePage from './pages/team/ProfilePage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import TeamsPage from './pages/admin/TeamsPage';
import TeamNewPage from './pages/admin/TeamNewPage';
import TeamImportPage from './pages/admin/TeamImportPage';
import GameControlPage from './pages/admin/GameControlPage';
import UploadPage from './pages/admin/UploadPage';

// Error pages
import NotFoundPage from './pages/error/NotFoundPage';
import UnauthorizedPage from './pages/error/UnauthorizedPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/scoreboard" element={<ScoreboardPage />} />

        {/* Team Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['ADMIN', 'TEACHER']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <ProtectedRoute requiredRoles={['ADMIN', 'TEACHER']}>
              <TeamsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teams/new"
          element={
            <ProtectedRoute requiredRoles={['ADMIN', 'TEACHER']}>
              <TeamNewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teams/import"
          element={
            <ProtectedRoute requiredRoles={['ADMIN', 'TEACHER']}>
              <TeamImportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/game"
          element={
            <ProtectedRoute requiredRoles={['ADMIN', 'TEACHER']}>
              <GameControlPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/upload"
          element={
            <ProtectedRoute requiredRoles={['ADMIN', 'TEACHER']}>
              <UploadPage />
            </ProtectedRoute>
          }
        />

        {/* Error Routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
