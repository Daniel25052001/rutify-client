import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CompanyLayout } from '../layouts/CompanyLayout';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout';
import { BusManagement } from '../pages/company/BusManagement';
import { LoginPage } from '../pages/auth/LoginPage';
import { AcceptInvitationPage } from '../pages/auth/AcceptInvitationPage'; // <--- 1. Importado aquí
import { SuperAdminDashboard } from '../pages/admin/SuperAdminDashboard';
import { InvitationsPage } from '../pages/admin/InvitationsPage';
import { ProtectedRoute } from './ProtectedRoute'; // <--- 2. Importado desde su propio archivo
import { authService } from '../services/authService';

/**
 * Componente temporal para el panel de control y estadísticas generales del SaaS (Empresa).
 */
const CompanyDashboard = () => <div className="p-8"><h2 className="text-xl font-semibold">Resumen de KPIs y Estadísticas</h2></div>;

/**
 * AppRoutes: Centraliza y gestiona el enrutamiento principal de la aplicación frontend,
 * separando las rutas públicas de autenticación y aplicando protección por roles.
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
                <Route path="/accept-invitation" element={<AcceptInvitationPage />} /> {/* <--- 3. Ruta pública de invitación */}

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
                {/* Rutas Protegidas: Administrador de Compañía (COMPANY_ADMIN)      */}
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