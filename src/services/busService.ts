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
        const token = localStorage.getItem('token'); // Recupera el token de sesión guardado
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
export interface BusDto {
    id?: string;
    plate: string;
    model?: string;
    capacity: number;
    status?: 'ACTIVE' | 'MAINTENANCE';
}

// ==========================================
// SERVICIO DE GESTIÓN DE FLOTA (CLIENTE)
// ==========================================
export const busService = {
    /**
     * Obtiene la lista completa de buses registrados para la compañía del usuario.
     */
    async getAllBuses(): Promise<BusDto[]> {
        try {
            const response = await api.get<BusDto[]>('/buses');
            return response.data;
        } catch (error) {
            console.error('Error al obtener la flota de buses:', error);
            throw error;
        }
    },

    /**
     * Registra un nuevo bus en el sistema a través del backend de NestJS.
     */
    async createBus(busData: BusDto): Promise<BusDto> {
        try {
            const response = await api.post<BusDto>('/buses', busData);
            return response.data;
        } catch (error) {
            console.error('Error al registrar el bus:', error);
            throw error;
        }
    },

    /**
     * Actualiza los datos o el estado de un bus existente mediante su ID (PATCH).
     */
    async updateBus(id: string, busData: Partial<BusDto>): Promise<BusDto> {
        try {
            const response = await api.patch<BusDto>(`/buses/${id}`, busData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar el bus con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina un bus del sistema por su ID.
     */
    async deleteBus(id: string): Promise<void> {
        try {
            await api.delete(`/buses/${id}`);
        } catch (error) {
            console.error(`Error al eliminar el bus con ID ${id}:`, error);
            throw error;
        }
    },
};