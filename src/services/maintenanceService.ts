import axios from 'axios';

/**
 * Instancia centralizada de Axios apuntando al backend con soporte para interceptores de autenticación.
 */
const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor para inyectar automáticamente el token JWT en cada petición HTTP.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================================
// INTERFACES Y TIPOS DE DATOS
// ==========================================
export interface MaintenanceTaskDto {
    id?: string;
    busId: string;
    title: string;
    type?: 'PREVENTIVE' | 'CORRECTIVE';
    intervalKm?: number;
    intervalDays?: number;
    lastPerformedKm?: number;
    lastPerformedDate?: string;
    status?: 'PENDING' | 'COMPLETED' | 'OVERDUE';
    createdAt?: string;
}

export interface MaintenanceLogDto {
    id?: string;
    busId: string;
    taskId?: string;
    mechanicName: string;
    cost: number;
    description: string;
    odometerAtService: number;
    performedAt?: string;
}

// ==========================================
// SERVICIO DE GESTIÓN DE MANTENIMIENTO (CLIENTE)
// ==========================================
export const maintenanceService = {
    /**
     * Obtiene el listado completo de todas las tareas de mantenimiento configuradas.
     */
    async getAllTasks(): Promise<MaintenanceTaskDto[]> {
        try {
            const response = await api.get<MaintenanceTaskDto[]>('/maintenance/tasks');
            return response.data;
        } catch (error) {
            console.error('Error al obtener las tareas de mantenimiento:', error);
            throw error;
        }
    },

    /**
     * Crea una nueva tarea planificada de mantenimiento.
     */
    async createTask(taskData: MaintenanceTaskDto): Promise<MaintenanceTaskDto> {
        try {
            const response = await api.post<MaintenanceTaskDto>('/maintenance/tasks', taskData);
            return response.data;
        } catch (error) {
            console.error('Error al crear la tarea de mantenimiento:', error);
            throw error;
        }
    },

    /**
     * Obtiene el historial de la bitácora de taller para un bus específico mediante parámetros de ruta.
     */
    async getLogsByBus(busId: string): Promise<MaintenanceLogDto[]> {
        try {
            const response = await api.get<MaintenanceLogDto[]>(`/maintenance/logs/bus/${busId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener la bitácora del bus ${busId}:`, error);
            throw error;
        }
    },

    /**
     * Registra una nueva intervención o reparación en la bitácora del taller.
     */
    async createLog(logData: MaintenanceLogDto): Promise<MaintenanceLogDto> {
        try {
            const response = await api.post<MaintenanceLogDto>('/maintenance/logs', logData);
            return response.data;
        } catch (error) {
            console.error('Error al registrar el mantenimiento en la bitácora:', error);
            throw error;
        }
    },
};