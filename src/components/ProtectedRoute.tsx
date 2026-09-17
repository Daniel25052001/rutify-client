import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Si no hay token, redirige al login de inmediato
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si se requiere un rol específico y no coincide, redirige o saca al usuario
    if (allowedRole && userRole !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    // Si todo está bien, muestra la página protegida
    return <Outlet />;
};