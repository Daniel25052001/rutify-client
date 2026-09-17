import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SuperAdminDashboard: Vista interna del Centro de Mando.
 * Ya no necesita incluir el header, ya que el SuperAdminLayout se encarga de eso automáticamente.
 */
export const SuperAdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Saludo de bienvenida */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Bienvenido al Centro de Mando 🚀
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Desde aquí puedes administrar el acceso corporativo y supervisar la infraestructura de flotas.
                </p>
            </div>

            {/* Grid de Módulos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tarjeta 1: Módulo de Invitaciones (Acción Principal) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            ✉️
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                            Módulo de Invitaciones
                        </h3>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                            Genera, visualiza y administra de forma segura las invitaciones de acceso para nuevos administradores de compañía y operadores de flota.
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Estado: Activo</span>
                        <button
                            onClick={() => navigate('/admin/invitations')}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-purple-100 transition-all duration-200 group-hover:translate-x-1"
                        >
                            Gestionar Invitaciones
                            <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Tarjeta 2: Métricas y Analíticas */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            📊
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            Métricas y Analíticas
                        </h3>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                            Visualiza el rendimiento general de la plataforma, estadísticas globales de flotas, consumo de recursos y reportes en tiempo real.
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            Próximamente
                        </span>
                        <button
                            disabled
                            className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed"
                        >
                            En Desarrollo
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};