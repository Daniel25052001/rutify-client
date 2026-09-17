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
        const token = localStorage.getItem('token'); // O la forma en que estés almacenando la sesión
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export interface BusDto {
    id?: string;
    plate: string;
    model: string;
    capacity: number;
    status?: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

export const busService = {
    async getAllBuses(): Promise<BusDto[]> {
        try {
            const response = await api.get<BusDto[]>('/buses');
            return response.data;
        } catch (error) {
            console.error('Error al obtener la flota de buses:', error);
            throw error;
        }
    },

    async createBus(busData: BusDto): Promise<BusDto> {
        try {
            const response = await api.post<BusDto>('/buses', busData);
            return response.data;
        } catch (error) {
            console.error('Error al registrar el bus:', error);
            throw error;
        }
    },
};