import React, { useState, useEffect } from 'react';
import { busService, type BusDto } from '../../services/busService';
import { MaintenanceModal } from '../../components/company/MaintenanceModal';

/**
 * BusManagement: Vista administrativa conectada al backend de NestJS mediante Axios.
 * Gestiona el ciclo de vida de la flota con paginación y búsqueda en servidor.
 */
export const BusManagement: React.FC = () => {
    // ==========================================
    // 1. DECLARACIÓN DE ESTADOS
    // ==========================================
    const [buses, setBuses] = useState<BusDto[]>([]); // Almacena la lista de buses paginada
    const [loading, setLoading] = useState<boolean>(true); // Controla el estado de carga inicial
    const [error, setError] = useState<string | null>(null); // Almacena mensajes de error si falla la API

    // Estados para paginación y búsqueda
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [search, setSearch] = useState<string>('');

    // Estados para controlar el modal de registro y edición
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBusId, setEditingBusId] = useState<string | null>(null);
    const [plate, setPlate] = useState('');
    const [capacity, setCapacity] = useState<number>(40);
    const [status, setStatus] = useState<'ACTIVE' | 'MAINTENANCE'>('ACTIVE');

    // ESTADO NUEVO: Controla qué bus está abierto en el modal de mantenimiento/taller
    const [selectedBus, setSelectedBus] = useState<{ id: string; plate: string } | null>(null);

    // ==========================================
    // 2. EFECTOS Y PETICIONES A LA API (BACKEND)
    // ==========================================

    // Carga la flota aplicando los parámetros de paginación y búsqueda
    useEffect(() => {
        fetchBuses();
    }, [page, search]);

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const response = await busService.getAllBuses({ page, limit, search });
            setBuses(response.data);
            setTotalPages(response.meta.lastPage);
            setError(null);
        } catch (err) {
            setError('No se pudo conectar con el servidor para cargar la flota.');
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 3. MANEJADORES DE ACCIONES (UI Y EVENTOS)
    // ==========================================

    const handleOpenCreateModal = () => {
        setEditingBusId(null);
        setPlate('');
        setCapacity(40);
        setStatus('ACTIVE');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (bus: BusDto) => {
        setEditingBusId(bus.id || null);
        setPlate(bus.plate);
        setCapacity(bus.capacity);
        setStatus(bus.status);
        setIsModalOpen(true);
    };

    const handleSaveBus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plate) return;

        try {
            if (editingBusId) {
                const updatedBus = await busService.updateBus(editingBusId, {
                    plate: plate.toUpperCase(),
                    capacity: Number(capacity),
                    status,
                });
                setBuses(buses.map((b) => (b.id === editingBusId ? updatedBus : b)));
            } else {
                await busService.createBus({
                    plate: plate.toUpperCase(),
                    capacity: Number(capacity),
                    status,
                });
                fetchBuses();
            }

            setIsModalOpen(false);
            setEditingBusId(null);
        } catch (err) {
            alert('Error al guardar el bus en el backend.');
        }
    };

    const handleToggleStatus = async (bus: BusDto) => {
        if (!bus.id) return;
        const newStatus = bus.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE';
        try {
            const updatedBus = await busService.updateBus(bus.id, {
                status: newStatus,
            });
            setBuses(buses.map((b) => (b.id === bus.id ? updatedBus : b)));
        } catch (err) {
            alert('No se pudo actualizar el estado del vehículo.');
        }
    };

    // ==========================================
    // 4. RENDERIZADO DE LA INTERFAZ (JSX)
    // ==========================================
    return (
        <div className="space-y-6">
            {/* Encabezado del módulo */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Gestión de Flota (Buses)</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Control vehicular centralizado y en tiempo real con soporte escalable.</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/30 transition-all duration-200"
                >
                    <span className="mr-2 text-base">+</span> Registrar Nuevo Bus
                </button>
            </div>

            {/* Barra de Búsqueda por Placa */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center">
                <input
                    type="text"
                    placeholder="Buscar vehículo por placa..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value.toUpperCase());
                        setPage(1);
                    }}
                    className="w-full sm:max-w-xs px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50 uppercase"
                />
            </div>

            {/* Manejo condicional de estados de carga y errores de conexión */}
            {loading && (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-sm text-purple-600 font-semibold animate-pulse">Cargando flota desde el servidor...</p>
                </div>
            )}
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

            {/* Tabla principal de vehículos registrados */}
            {!loading && !error && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unidades Registradas</span>
                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                            Página {page} de {totalPages || 1}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                                    <th className="py-4 px-6">Placa</th>
                                    <th className="py-4 px-6">Capacidad</th>
                                    <th className="py-4 px-6">Estado</th>
                                    <th className="py-4 px-6 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {buses.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                                            No se encontraron buses registrados con los filtros actuales.
                                        </td>
                                    </tr>
                                ) : (
                                    buses.map((bus) => (
                                        <tr key={bus.id || bus.plate} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="py-4 px-6 font-bold text-gray-900">{bus.plate}</td>
                                            <td className="py-4 px-6 text-gray-600">{bus.capacity} pasajeros</td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => handleToggleStatus(bus)}
                                                    title="Clic para cambiar estado"
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-transform active:scale-95 cursor-pointer ${bus.status === 'ACTIVE'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100'
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${bus.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-amber-600'
                                                            }`}
                                                    />
                                                    {bus.status === 'ACTIVE' ? 'Operativo' : 'En Mantenimiento'}
                                                </button>
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                {/* NUEVO: Botón de Taller integrado por cada fila de bus */}
                                                {bus.id && (
                                                    <button
                                                        onClick={() => setSelectedBus({ id: bus.id!, plate: bus.plate })}
                                                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                                    >
                                                        🛠️ Taller
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleOpenEditModal(bus)}
                                                    className="text-purple-600 hover:text-purple-800 font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Controles de Paginación Inferior */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            ← Anterior
                        </button>
                        <span className="text-xs font-semibold text-gray-500">
                            Página <strong>{page}</strong> de <strong>{totalPages || 1}</strong>
                        </span>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page >= totalPages}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}

            {/* Modal flotante para crear o editar un vehículo */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-extrabold text-gray-900">
                                {editingBusId ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveBus} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Placa</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: ABC1234"
                                    value={plate}
                                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Capacidad de Pasajeros</label>
                                <input
                                    type="number"
                                    required
                                    min="10"
                                    max="70"
                                    value={capacity}
                                    onChange={(e) => setCapacity(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Estado Operativo</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'MAINTENANCE')}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50/50"
                                >
                                    <option value="ACTIVE">🟢 Operativo (Activo)</option>
                                    <option value="MAINTENANCE">🟡 En Mantenimiento</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/25 transition-all"
                                >
                                    {editingBusId ? 'Actualizar Bus' : 'Guardar Bus'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* NUEVO: Renderizado condicional del Modal de Mantenimiento / Taller */}
            {selectedBus && (
                <MaintenanceModal
                    busId={selectedBus.id}
                    busPlate={selectedBus.plate}
                    onClose={() => setSelectedBus(null)}
                />
            )}
        </div>
    );
};

export default BusManagement;