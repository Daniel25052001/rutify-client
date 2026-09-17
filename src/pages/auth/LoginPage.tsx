import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

/**
 * LoginPage: Gestiona la autenticación, almacenamiento unificado de credenciales
 * (cubriendo ambas llaves de localStorage) y redirección basada en roles.
 */
export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await authService.login({ email, password });

            const token = response.accessToken;
            const role = response.user?.role;

            if (!token || !role) {
                throw new Error('La respuesta del servidor no contiene el token o el rol.');
            }

            // UNIFICACIÓN DE LLAVES: Guardamos con ambas variantes para evitar conflictos de nombres
            localStorage.setItem('token', token);
            localStorage.setItem('accessToken', token);
            localStorage.setItem('userRole', role);

            // Redirección limpia según el rol
            if (role === 'SUPER_ADMIN') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }

        } catch (err: any) {
            setError(err.response?.data?.message || 'Credenciales inválidas o error en el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">RUTIFY SaaS</h2>
                    <p className="text-sm text-gray-500">Panel de Administración de Flota</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="superrutify@gmail.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loading ? 'Validando credenciales...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};