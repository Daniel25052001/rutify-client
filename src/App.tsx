import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CompanyLayout } from './layouts/CompanyLayout';
import { SuperAdminLayout } from './layouts/SuperAdminLayout';
import { BusManagement } from './pages/company/BusManagement';
import { LoginPage } from './pages/auth/LoginPage';
import { AcceptInvitationPage } from './pages/auth/AcceptInvitationPage'; // 👈 1. Importar la página de aceptación
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard';
import { InvitationsPage } from './pages/admin/InvitationsPage';
import { authService } from './services/authService';

/**
 * Componente temporal para el panel de control y estadísticas generales de la compañía.
 */
const CompanyDashboard = () => <div className="p-8"><h2 className="text-xl font-semibold">Resumen de KPIs y Estadísticas</h2></div>;

/**
 * Interface para las propiedades del componente ProtectedRoute.
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: string;
}

/**
 * ProtectedRoute: Componente de orden superior (Route Guard) encargado de interceptar
 * las peticiones a rutas privadas, validando la existencia de un token JWT válido
 * y asegurando que el rol almacenado coincida con el requerido.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const token = authService.getToken();
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * AppRoutes / App: Enrutador central y unificado de la aplicación.
 */
export const App: React.FC = () => {
  const token = authService.getToken();
  const isAuthenticated = !!token;
  const userRole = localStorage.getItem('userRole');

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Rutas Públicas de Autenticación y Registro */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/accept-invitation" element={<AcceptInvitationPage />} /> {/* 👈 2. Registrar la ruta pública */}

        {/* 2. Rutas Protegidas: Super Administrador (Usan SuperAdminLayout automáticamente) */}
        <Route
          element={
            <ProtectedRoute allowedRole="SUPER_ADMIN">
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/admin/invitations" element={<InvitationsPage />} />
        </Route>

        {/* 3. Rutas Protegidas: Administrador de Compañía (Usan CompanyLayout) */}
        <Route
          element={
            <ProtectedRoute allowedRole="COMPANY_ADMIN">
              <CompanyLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<CompanyDashboard />} />
          <Route path="/fleet/buses" element={<BusManagement />} />
          <Route path="/routes/manage" element={<div className="p-8"><h2 className="text-xl font-semibold">Gestión de Rutas y Trayectos</h2></div>} />
          <Route path="/trips/schedule" element={<div className="p-8"><h2 className="text-xl font-semibold">Programación de Viajes</h2></div>} />
        </Route>

        {/* 4. Ruta Comodín: Redirección Inteligente por Rol */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                !isAuthenticated
                  ? '/login'
                  : userRole === 'SUPER_ADMIN'
                    ? '/admin/dashboard'
                    : '/dashboard'
              }
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;