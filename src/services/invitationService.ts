import axios from 'axios';

const API_URL = 'http://localhost:3000'; // URL de tu backend

// Interfaz que define los datos necesarios para invitar a un usuario
interface CreateInvitationDto {
    email: string;
    companyId: string;
    role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'DRIVER'; // Ajusta según tus roles permitidos
}

export const invitationService = {
    /**
     * Envía una nueva invitación consumiendo el endpoint protegido del backend
     */
    createInvitation: async (data: CreateInvitationDto) => {
        const token = localStorage.getItem('accessToken');

        const response = await axios.post(`${API_URL}/invitations`, data, {
            headers: {
                Authorization: `Bearer ${token}`, // Inyectamos el Bearer Token del Super Admin
            },
        });

        return response.data;
    },

    /**
     * Obtiene la lista de invitaciones existentes para mostrarlas en la tabla
     */
    getInvitations: async () => {
        const token = localStorage.getItem('accessToken');

        const response = await axios.get(`${API_URL}/invitations`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },
};