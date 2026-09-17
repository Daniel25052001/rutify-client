import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

/**
 * CompanyLayout: Estructura visual para los administradores de empresa.
 * Mantiene fija la barra lateral de navegación y un encabezado de sesión,
 * permitiendo renderizar las vistas hijas dinámicamente mediante <Outlet />.
 */
export const CompanyLayout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Barra lateral de navegación */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-wider text-purple-400">RUTIFY SaaS</h1>
                    <p className="text-xs text-gray-400 mt-1">Panel de Compañía</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link to="/dashboard" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        📊 Resumen / KPIs
                    </Link>
                    <Link to="/fleet/buses" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        🚌 Gestión de Flota (Buses)
                    </Link>
                    <Link to="/routes/manage" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        🗺️ Rutas y Trayectos
                    </Link>
                    <Link to="/trips/schedule" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        🕒 Programación de Viajes
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-red-500/30 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800">Módulo B2B</h2>
                    <span className="text-sm font-medium text-gray-600">Compañía de Transporte</span>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};