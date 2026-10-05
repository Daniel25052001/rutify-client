import React, { useState, useEffect } from 'react';

interface MaintenanceTask {
    id: string;
    busId: string;
    title: string;
    type: 'PREVENTIVE' | 'CORRECTIVE';
    status: string;
    intervalKm?: number;
}

export default function MaintenancePage() {
    const [tasks, setTasks] = useState<MaintenanceTask[]>([]);

    // Estados para nueva Tarea
    const [newBusId, setNewBusId] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newType, setNewType] = useState<'PREVENTIVE' | 'CORRECTIVE'>('PREVENTIVE');
    const [newIntervalKm, setNewIntervalKm] = useState('');

    // Estados para Registro en Bitácora (Log)
    const [logBusId, setLogBusId] = useState('');
    const [logTaskId, setLogTaskId] = useState('');
    const [logMechanic, setLogMechanic] = useState('');
    const [logCost, setLogCost] = useState('');
    const [logDescription, setLogDescription] = useState('');
    const [logOdometer, setLogOdometer] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3000/maintenance/tasks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error('Error al cargar tareas de mantenimiento:', error);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/maintenance/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    busId: newBusId,
                    title: newTitle,
                    type: newType,
                    intervalKm: newIntervalKm ? Number(newIntervalKm) : undefined
                })
            });

            if (response.ok) {
                setNewBusId('');
                setNewTitle('');
                setNewIntervalKm('');
                fetchTasks();
            }
        } catch (error) {
            console.error('Error al crear la tarea:', error);
        }
    };

    const handleCreateLog = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/maintenance/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    busId: logBusId,
                    taskId: logTaskId || undefined,
                    mechanicName: logMechanic,
                    cost: Number(logCost),
                    description: logDescription,
                    odometerAtService: Number(logOdometer)
                })
            });

            if (response.ok) {
                setLogBusId('');
                setLogTaskId('');
                setLogMechanic('');
                setLogCost('');
                setLogDescription('');
                setLogOdometer('');
                fetchTasks(); // Recarga para ver cambios de estado si completó una tarea
                alert('¡Intervención registrada y tarea actualizada con éxito!');
            }
        } catch (error) {
            console.error('Error al registrar la bitácora:', error);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold">Gestión de Taller y Mantenimiento</h1>
                    <p className="text-sm text-gray-500">Módulo exclusivo para administradores de empresa.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Formulario Programar Tarea */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-lg font-semibold mb-4">Programar Nueva Tarea</h2>
                    <form onSubmit={handleCreateTask} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">UUID del Bus</label>
                            <input
                                type="text"
                                value={newBusId}
                                onChange={(e) => setNewBusId(e.target.value)}
                                className="w-full border rounded p-2 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Título</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full border rounded p-2 text-sm"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tipo</label>
                                <select
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value as any)}
                                    className="w-full border rounded p-2 text-sm"
                                >
                                    <option value="PREVENTIVE">Preventivo</option>
                                    <option value="CORRECTIVE">Correctivo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Intervalo (Km)</label>
                                <input
                                    type="number"
                                    value={newIntervalKm}
                                    onChange={(e) => setNewIntervalKm(e.target.value)}
                                    className="w-full border rounded p-2 text-sm"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
                        >
                            Guardar Tarea
                        </button>
                    </form>
                </div>

                {/* 2. Formulario Registrar Bitácora / Taller */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-lg font-semibold mb-4">Registrar Reparación (Log)</h2>
                    <form onSubmit={handleCreateLog} className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium mb-1">UUID del Bus</label>
                            <input
                                type="text"
                                value={logBusId}
                                onChange={(e) => setLogBusId(e.target.value)}
                                className="w-full border rounded p-2 text-xs"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">ID Tarea (Opcional)</label>
                            <input
                                type="text"
                                value={logTaskId}
                                onChange={(e) => setLogTaskId(e.target.value)}
                                placeholder="Vincula si estaba programada"
                                className="w-full border rounded p-2 text-xs"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium mb-1">Mecánico / Taller</label>
                                <input
                                    type="text"
                                    value={logMechanic}
                                    onChange={(e) => setLogMechanic(e.target.value)}
                                    className="w-full border rounded p-2 text-xs"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Costo ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={logCost}
                                    onChange={(e) => setLogCost(e.target.value)}
                                    className="w-full border rounded p-2 text-xs"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Kilometraje actual (Odómetro)</label>
                            <input
                                type="number"
                                value={logOdometer}
                                onChange={(e) => setLogOdometer(e.target.value)}
                                className="w-full border rounded p-2 text-xs"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Descripción</label>
                            <input
                                type="text"
                                value={logDescription}
                                onChange={(e) => setLogDescription(e.target.value)}
                                className="w-full border rounded p-2 text-xs"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 text-white py-2 rounded font-medium hover:bg-emerald-700 transition text-sm"
                        >
                            Registrar en Bitácora
                        </button>
                    </form>
                </div>

                {/* 3. Listado de Tareas Programadas */}
                <div className="bg-white p-6 rounded-lg shadow border flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Tareas Programadas</h2>
                    <div className="space-y-3 overflow-y-auto max-h-[420px] flex-1">
                        {tasks.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-6">No hay tareas registradas.</p>
                        ) : (
                            tasks.map((task) => (
                                <div key={task.id} className="border p-3 rounded flex justify-between items-center text-xs">
                                    <div>
                                        <p className="font-semibold text-gray-800">{task.title}</p>
                                        <p className="text-gray-500">Bus: {task.busId.substring(0, 8)}...</p>
                                        <p className="text-blue-600 font-medium mt-1">Estado: {task.status}</p>
                                    </div>
                                    <span className="px-2 py-1 rounded bg-gray-100 font-semibold">
                                        {task.type}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}