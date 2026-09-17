import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

/**
 * SuperAdminLayout: Layout principal para el panel de Super Administrador.
 * Contiene la barra superior fija global y un <Outlet /> para renderizar las vistas hijas.
 */
export const SuperAdminLayout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Barra Superior / Header Global */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
                        <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-200">
                            R
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">RUTIFY SaaS</h1>
                            <p className="text-xs text-slate-500">Panel de Control Global</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            <span className="w-2 h-2 mr-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                            SUPER_ADMIN
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-semibold rounded-lg transition-all duration-200 border border-slate-200 hover:border-red-200 shadow-sm flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenedor principal donde se inyectan las vistas hijas */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
};