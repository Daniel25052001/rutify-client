import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const MaintenanceType = {
    PREVENTIVE: 'PREVENTIVE',
    CORRECTIVE: 'CORRECTIVE',
} as const;

export type MaintenanceTypeValues = typeof MaintenanceType[keyof typeof MaintenanceType];

export const MaintenanceStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
} as const;

export type MaintenanceStatusValues = typeof MaintenanceStatus[keyof typeof MaintenanceStatus];

interface MaintenanceTaskDto {
    id: string;
    busId: string;
    title: string;
    type: MaintenanceTypeValues;
    status?: MaintenanceStatusValues;
}

interface MaintenanceModalProps {
    busId: string;
    busPlate: string;
    onClose: () => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ busId, busPlate, onClose }) => {
    const [tasks, setTasks] = useState<MaintenanceTaskDto[]>([]);
    const [title, setTitle] = useState('');
    const [type, setType] = useState<MaintenanceTypeValues>(MaintenanceType.PREVENTIVE);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, [busId]);

    const fetchTasks = async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/maintenance/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const filteredTasks = response.data.filter((task: MaintenanceTaskDto) => task.busId === busId);
            setTasks(filteredTasks);
        } catch (error) {
            console.error("Error al cargar las tareas:", error);
        } finally {
            setFetching(false);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            await axios.post('http://localhost:3000/maintenance/tasks', {
                busId,
                title,
                type,
                status: MaintenanceStatus.PENDING,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTitle('');
            setType(MaintenanceType.PREVENTIVE);
            fetchTasks();
        } catch (error) {
            console.error("Error al crear la tarea de mantenimiento:", error);
        } finally {
            setLoading(false);
        }
    };






    // Función para alternar o completar la tarea (Simulación lógica o llamada PATCH/DELETE según tu backend)
    const handleToggleComplete = async (taskId: string, currentStatus?: string) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = currentStatus === MaintenanceStatus.COMPLETED ? MaintenanceStatus.PENDING : MaintenanceStatus.COMPLETED;

            // Si tu backend soporta PATCH /maintenance/tasks/:id puedes descomunicarlo, 
            // por ahora actualizamos visualmente o con endpoint si existe:
            await axios.patch(`http://localhost:3000/maintenance/tasks/${taskId}`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchTasks();
        } catch (error) {
            console.error("No se pudo actualizar el estado de la tarea (quizás falte el endpoint PATCH en backend):", error);
            // Actualización optimista local en caso de que el endpoint del backend esté pendiente
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: t.status === MaintenanceStatus.COMPLETED ? MaintenanceStatus.PENDING : MaintenanceStatus.COMPLETED } : t));
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        // Eliminación optimista inmediata en la interfaz para que responda al instante
        const previousTasks = [...tasks];
        setTasks(tasks.filter(t => t.id !== taskId));

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/maintenance/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error al eliminar la tarea en el servidor:", error);
            // Si falla en el backend, revertimos el cambio en la vista para mantener consistencia
            setTasks(previousTasks);
            alert("No se pudo eliminar la tarea en el servidor. Verifica que el endpoint DELETE esté configurado en NestJS.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-end z-50 transition-opacity animate-fadeIn">
            <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-gray-100">

                {/* Cabecera superior */}
                <div className="px-6 py-5 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                            Unidad / Placa: {busPlate}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900 mt-1">Gestión de Taller</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
                    >
                        <span className="text-xl font-semibold">&times;</span>
                    </button>
                </div>

                {/* Contenido principal scrolleable */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                    {/* Formulario de creación moderno */}
                    <form onSubmit={handleCreateTask} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4 ring-1 ring-gray-950/5">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <h3 className="text-sm font-bold text-gray-800">Programar nueva tarea</h3>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-600">Título de la tarea</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej. Cambio de pastillas de freno y revisión..."
                                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all placeholder:text-gray-400"
                                maxLength={150}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-600">Tipo de Mantenimiento</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setType(MaintenanceType.PREVENTIVE)}
                                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${type === MaintenanceType.PREVENTIVE
                                        ? 'bg-purple-50 border-purple-600 text-purple-700 shadow-xs'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    🛡️ Preventivo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType(MaintenanceType.CORRECTIVE)}
                                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${type === MaintenanceType.CORRECTIVE
                                        ? 'bg-rose-50 border-rose-600 text-rose-700 shadow-xs'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    🔧 Correctivo
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm shadow-purple-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                            ) : (
                                <span>Registrar Tarea</span>
                            )}
                        </button>
                    </form>

                    {/* Sección de listado con control de estado */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tareas Programadas</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                {tasks.length}
                            </span>
                        </div>

                        {fetching ? (
                            <div className="text-center py-10">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
                                <p className="text-xs text-gray-400 mt-2">Cargando tareas...</p>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-12 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <div className="text-2xl mb-2">📋</div>
                                <p className="text-sm font-medium text-gray-600">No hay tareas programadas</p>
                                <p className="text-xs text-gray-400 mt-1">Las tareas que agregues aparecerán aquí.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {tasks.map((task) => {
                                    const isCompleted = task.status === MaintenanceStatus.COMPLETED;
                                    return (
                                        <div
                                            key={task.id}
                                            className={`p-4 bg-white border rounded-2xl shadow-xs transition-all flex items-center justify-between group ${isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-gray-100'
                                                }`}
                                        >
                                            <div className="space-y-1 pr-2">
                                                <p className={`text-sm font-semibold leading-tight ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                    {task.title}
                                                </p>
                                                <div className="flex items-center space-x-2 pt-1">
                                                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${task.type === 'PREVENTIVE'
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                                                        }`}>
                                                        {task.type}
                                                    </span>
                                                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${isCompleted
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                        }`}>
                                                        {isCompleted ? 'Completada' : 'Pendiente'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Botones de acción rápida para cambiar estado o eliminar */}
                                            <div className="flex items-center space-x-1">
                                                <button
                                                    onClick={() => handleToggleComplete(task.id, task.status)}
                                                    title={isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
                                                    className={`p-2 rounded-xl transition-colors cursor-pointer ${isCompleted
                                                        ? 'text-emerald-600 hover:bg-emerald-100'
                                                        : 'text-gray-300 hover:text-emerald-600 hover:bg-emerald-50'
                                                        }`}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    title="Eliminar tarea"
                                                    className="p-2 rounded-xl text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie de página */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-xs"
                    >
                        Cerrar Panel
                    </button>
                </div>
            </div>
        </div>
    );
};