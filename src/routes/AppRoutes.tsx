import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CompanyLayout } from '../layouts/CompanyLayout';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout'; // <--- 1. Importa tu layout de Super Admin
import { BusManagement } from '../pages/company/BusManagement';
import { LoginPage } from '../pages/auth/LoginPage';
import { SuperAdminDashboard } from '../pages/admin/SuperAdminDashboard';
import { InvitationsPage } from '../pages/admin/InvitationsPage';
import { authService } from '../services/authService';

/**
 * Componente temporal para el panel de control y estadísticas generales del SaaS (Empresa).
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
 * y asegurando que el rol almacenado coincida con el requerido para el acceso.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
    const token = authService.getToken();
    const userRole = localStorage.getItem('userRole');

    // Validación 1: Si no hay token de sesión, redirige al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Validación 2: Si el rol del usuario no coincide con el permitido, bloquea el acceso
    if (allowedRole && userRole !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

/**
 * AppRoutes: Centraliza y gestiona el enrutamiento principal de la aplicación frontend,
 * separando las rutas públicas de autenticación y aplicando protección por roles 
 * (SUPER_ADMIN y COMPANY_ADMIN) mediante el componente ProtectedRoute.
 */
export const AppRoutes: React.FC = () => {
    const token = authService.getToken();
    const isAuthenticated = !!token;
    const userRole = localStorage.getItem('userRole');

    return (
        <BrowserRouter>
            <Routes>
                {/* ----------------------------------------------------------------- */}
                {/* Rutas Públicas                                                   */}
                {/* ----------------------------------------------------------------- */}
                <Route path="/login" element={<LoginPage />} />

                {/* ----------------------------------------------------------------- */}
                {/* Rutas Protegidas: Super Administrador (SUPER_ADMIN)               */}
                {/* ----------------------------------------------------------------- */}
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

                {/* ----------------------------------------------------------------- */}
                {/* Rutas Protegidas: Administrador de Compañía (COMPANY_ADMIN)       */}
                {/* ----------------------------------------------------------------- */}
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

                {/* ----------------------------------------------------------------- */}
                {/* Ruta Comodín: Redirección Inteligente por Estado y Rol             */}
                {/* ----------------------------------------------------------------- */}
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