import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export const CompanyLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Función para validar la ruta activa y dar estilo morado distintivo
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans">
            {/* Barra lateral de navegación moderna */}
            <aside className="w-72 bg-gray-900 text-white flex flex-col shadow-2xl border-r border-gray-800/60 z-20">
                {/* Logo y Marca */}
                <div className="p-6 border-b border-gray-800/80 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shadow-inner">
                        ⚡
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-wider text-white">RUTIFY <span className="text-purple-400">SaaS</span></h1>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">Panel de Compañía</p>
                    </div>
                </div>

                {/* Navegación Principal */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Menú Principal</p>

                    <Link
                        to="/dashboard"
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/dashboard')
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 translate-x-1'
                                : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                            }`}
                    >
                        <span className="mr-3 text-base">📊</span> Resumen / KPIs
                    </Link>

                    <Link
                        to="/fleet/buses"
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/fleet/buses')
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 translate-x-1'
                                : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                            }`}
                    >
                        <span className="mr-3 text-base">🚌</span> Gestión de Flota
                    </Link>

                    <Link
                        to="/routes/manage"
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/routes/manage')
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 translate-x-1'
                                : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                            }`}
                    >
                        <span className="mr-3 text-base">🗺️</span> Rutas y Trayectos
                    </Link>

                    <Link
                        to="/trips/schedule"
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/trips/schedule')
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 translate-x-1'
                                : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                            }`}
                    >
                        <span className="mr-3 text-base">🕒</span> Programación de Viajes
                    </Link>
                </nav>

                {/* Footer de la Barra Lateral con Cerrar Sesión */}
                <div className="p-4 border-t border-gray-800/80 bg-gray-950/30">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 shadow-sm"
                    >
                        <span>🚪</span>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Superior Moderno */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-8 shadow-xs z-10">
                    <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100">
                            Módulo B2B
                        </span>
                        <h2 className="text-sm font-bold text-gray-700 hidden sm:block">Panel Administrativo de Flota</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-gray-800">Compañía de Transporte</p>
                                <p className="text-[10px] font-semibold text-emerald-600">● Cuenta Verificada</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center shadow-md shadow-purple-600/20">
                                CT
                            </div>
                        </div>
                    </div>
                </header>

                {/* Área de trabajo renderizada con el Outlet */}
                <main className="flex-1 overflow-y-auto p-8 bg-gray-50/70">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyLayout;