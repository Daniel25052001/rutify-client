import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole: string;
}

/**
 * ProtectedRoute: Componente de orden superior (Route Guard) encargado de interceptar
 * las peticiones a rutas privadas, validando la existencia de un token JWT válido
 * y asegurando que el rol almacenado coincida con el requerido para el acceso.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
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