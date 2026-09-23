import axios from 'axios';

const API_URL = 'http://localhost:3000'; // URL de tu backend

// Interfaz que define los datos necesarios para invitar a un usuario
export interface CreateInvitationDto {
    email: string;
    companyId?: string; // Opcional según si tu backend lo exige en el body o param
    role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'FLEET_OPERATOR' | 'DRIVER';
}

export interface Invitation {
    id: string;
    email: string;
    role: string;
    token: string;
    expiresAt: string;
    isUsed: boolean;
    createdAt: string;
}

export const invitationService = {
    /**
     * Envía una nueva invitación consumiendo el endpoint protegido del backend
     */
    createInvitation: async (data: CreateInvitationDto): Promise<Invitation> => {
        const token = localStorage.getItem('accessToken');

        const response = await axios.post(`${API_URL}/invitations`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },

    /**
     * Obtiene la lista de invitaciones existentes para mostrarlas en la tabla
     */
    getInvitations: async (): Promise<Invitation[]> => {
        const token = localStorage.getItem('accessToken');

        const response = await axios.get(`${API_URL}/invitations`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },

    /**
     * Revoca o elimina una invitación existente
     */
    revokeInvitation: async (id: string): Promise<void> => {
        const token = localStorage.getItem('accessToken');

        await axios.delete(`${API_URL}/invitations/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};