import React, { useState, useEffect } from 'react';
import { busService, type BusDto } from '../../services/busService';

/**
 * BusManagement: Vista administrativa conectada al backend de NestJS mediante Axios.
 * Gestiona el ciclo de vida de la flota con consultas en tiempo real.
 */
export const BusManagement: React.FC = () => {
    const [buses, setBuses] = useState<BusDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPlate, setNewPlate] = useState('');
    const [newModel, setNewModel] = useState('');
    const [newCapacity, setNewCapacity] = useState(40);

    // Carga inicial de la flota al montar el componente
    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const data = await busService.getAllBuses();
            setBuses(data);
            setError(null);
        } catch (err) {
            setError('No se pudo conectar con el servidor para cargar la flota.');
        } finally {
            setLoading(false);
        }
    };

    // Manejador para registrar un bus enviándolo a la API
    const handleCreateBus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlate || !newModel) return;

        try {
            const createdBus = await busService.createBus({
                plate: newPlate.toUpperCase(),
                model: newModel,
                capacity: Number(newCapacity),
                status: 'ACTIVE',
            });

            setBuses([createdBus, ...buses]);
            setNewPlate('');
            setNewModel('');
            setIsModalOpen(false);
        } catch (err) {
            alert('Error al registrar el bus en el backend.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Flota (Buses)</h2>
                    <p className="text-sm text-gray-500">Conectado al servidor de NestJS para control vehicular.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    + Registrar Nuevo Bus
                </button>
            </div>

            {/* Manejo de estados de carga y error */}
            {loading && <p className="text-sm text-gray-500">Cargando flota desde el servidor...</p>}
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            {/* Tabla de vehículos */}
            {!loading && !error && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="py-3.5 px-6">Placa</th>
                                <th className="py-3.5 px-6">Modelo / Carrocería</th>
                                <th className="py-3.5 px-6">Capacidad</th>
                                <th className="py-3.5 px-6">Estado</th>
                                <th className="py-3.5 px-6 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {buses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-400">
                                        No hay buses registrados en la base de datos.
                                    </td>
                                </tr>
                            ) : (
                                buses.map((bus) => (
                                    <tr key={bus.id || bus.plate} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-gray-900">{bus.plate}</td>
                                        <td className="py-4 px-6 text-gray-600">{bus.model}</td>
                                        <td className="py-4 px-6 text-gray-600">{bus.capacity} pasajeros</td>
                                        <td className="py-4 px-6">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${bus.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                    }`}
                                            >
                                                {bus.status === 'ACTIVE' ? 'Operativo' : 'En Mantenimiento'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-2">
                                            <button className="text-purple-600 hover:text-purple-800 font-medium text-xs">Editar</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de Registro */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Registrar Nuevo Vehículo</h3>
                        <form onSubmit={handleCreateBus} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Placa</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: ABC-123"
                                    value={newPlate}
                                    onChange={(e) => setNewPlate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Modelo del Bus</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Marcopolo Viaggio"
                                    value={newModel}
                                    onChange={(e) => setNewModel(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Capacidad de Pasajeros</label>
                                <input
                                    type="number"
                                    required
                                    min="10"
                                    max="70"
                                    value={newCapacity}
                                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
                                >
                                    Guardar Bus
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};