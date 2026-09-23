import React, { useState, useEffect } from 'react';
import { invitationService } from '../../services/invitationService';
import { useNavigate } from 'react-router-dom';

/**
 * InvitationsPage: Vista administrativa exclusiva para Super Administradores.
 * Permite listar las invitaciones existentes en el sistema, enviar nuevas 
 * invitaciones asociadas a una compañía y un rol específico, y revocar las vigentes.
 */
export const InvitationsPage: React.FC = () => {
    // --- ESTADOS LOCALES DEL COMPONENTE ---
    const [invitations, setInvitations] = useState<any[]>([]); // Almacena la lista de invitaciones obtenidas del backend
    const [email, setEmail] = useState('');                    // Captura el correo del usuario a invitar
    const [companyId, setCompanyId] = useState('');            // Captura el UUID de la compañía destino
    const [role, setRole] = useState<'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'DRIVER'>('DRIVER'); // Rol asignado por defecto
    const [error, setError] = useState<string | null>(null);   // Manejo de mensajes de error visuales
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Mensaje de éxito en operaciones
    const [loading, setLoading] = useState(false);             // Estado de carga para bloquear botones durante peticiones
    const [generatedTokenUrl, setGeneratedTokenUrl] = useState<string | null>(null); // Permite ver el enlace generado en pantalla

    const navigate = useNavigate();

    // --- CICLO DE VIDA (useEffect) ---
    // Se ejecuta automáticamente al montar el componente para cargar la lista inicial de invitaciones
    useEffect(() => {
        fetchInvitations();
    }, []);

    /**
     * fetchInvitations: Obtiene el listado completo de invitaciones desde el backend
     * utilizando el servicio protegido con token JWT.
     */
    const fetchInvitations = async () => {
        try {
            const data = await invitationService.getInvitations();
            setInvitations(data);
        } catch (err) {
            setError('No se pudieron cargar las invitaciones.');
        }
    };

    /**
     * handleInviteSubmit: Controla el envío del formulario para registrar una nueva invitación.
     * Envía los datos al backend y actualiza la tabla automáticamente si es exitoso.
     */
    const handleInviteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setGeneratedTokenUrl(null);
        setLoading(true);
        try {
            // Hacemos el cast a 'any' para que TypeScript no restringa la propiedad token que devuelve el backend
            const response: any = await invitationService.createInvitation({ email, companyId, role });
            setSuccessMessage('¡Invitación creada y enviada con éxito!');

            if (response && response.invitationToken) {
                const inviteUrl = `${window.location.origin}/accept-invitation?token=${response.invitationToken}`;
                setGeneratedTokenUrl(inviteUrl);
            }

            setEmail('');
            setCompanyId('');
            fetchInvitations();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al procesar la invitación.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * handleRevoke: Permite dar de baja una invitación activa mediante su identificador único.
     * Solicita confirmación previa al administrador antes de ejecutar la acción.
     * 
     * @param id - UUID de la invitación que se desea revocar.
     */
    const handleRevoke = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas revocar esta invitación?')) return;

        setError(null);
        setSuccessMessage(null);
        setGeneratedTokenUrl(null);

        try {
            await invitationService.revokeInvitation(id);
            setSuccessMessage('Invitación revocada exitosamente.');
            fetchInvitations(); // Recargamos la tabla para reflejar el cambio de estado
        } catch (err: any) {
            setError(err.response?.data?.message || 'No se pudo revocar la invitación.');
        }
    };

    return (
        // CONTENEDOR PRINCIPAL: Fondo gris claro, altura mínima de pantalla y espaciado general
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* SECCIÓN DE CABECERA: Título descriptivo y botón de navegación de retorno */}
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Gestión de Invitaciones</h1>
                        <p className="text-sm text-slate-500">Panel exclusivo para Super Administrador</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                        ← Volver al Dashboard
                    </button>
                </div>

                {/* BLOQUE DE ALERTAS: Muestra retroalimentación visual de éxito o error */}
                {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">{error}</div>}
                {successMessage && <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">{successMessage}</div>}

                {/* CAJA INFORMATIVA DE ENLACE GENERADO (Útil para pruebas locales) */}
                {generatedTokenUrl && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-800">Enlace de invitación generado (Cópialo para probar):</p>
                        <input
                            type="text"
                            readOnly
                            value={generatedTokenUrl}
                            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-mono text-slate-700 select-all focus:outline-none"
                        />
                    </div>
                )}

                {/* FORMULARIO DE CREACIÓN: Inputs organizados en una cuadrícula responsiva */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Enviar Nueva Invitación</h2>

                    <form onSubmit={handleInviteSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Campo de Correo Electrónico */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Correo</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="usuario@correo.com"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Campo de ID de Compañía (UUID) */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Compañía ID</label>
                            <input
                                type="text"
                                required
                                value={companyId}
                                onChange={(e) => setCompanyId(e.target.value)}
                                placeholder="uuid-compania"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Selector de Rol */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Rol</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            >
                                <option value="DRIVER">DRIVER</option>
                                <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            </select>
                        </div>

                        {/* Botón de envío con estado de carga interactivo */}
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-200 disabled:opacity-50"
                            >
                                {loading ? 'Enviando...' : 'Enviar Invitación'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* TABLA DE REGISTROS: Muestra el historial actual de invitaciones y opciones de gestión */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Historial de Invitaciones</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="p-4">Correo Electrónico</th>
                                    <th className="p-4">ID de Compañía</th>
                                    <th className="p-4">Rol Asignado</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {invitations.length > 0 ? (
                                    invitations.map((inv) => {
                                        // Validación basada en la propiedad real del esquema (acceptedAt) y fecha de expiración
                                        const isAccepted = !!inv.acceptedAt;
                                        const isExpired = new Date() > new Date(inv.expiresAt);

                                        return (
                                            <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 font-medium text-slate-900">{inv.email}</td>
                                                <td className="p-4 font-mono text-xs text-slate-400">{inv.companyId}</td>
                                                <td className="p-4">
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold">
                                                        {inv.role}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {isAccepted ? (
                                                        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-bold">
                                                            Utilizada
                                                        </span>
                                                    ) : isExpired ? (
                                                        <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-bold">
                                                            Expirada
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold">
                                                            Pendiente
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {/* Se muestra el botón de revocar únicamente si la invitación no ha sido utilizada ni expirado */}
                                                    {!isAccepted && !isExpired && (
                                                        <button
                                                            onClick={() => handleRevoke(inv.id)}
                                                            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            Revocar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                                            No se encontraron invitaciones registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};