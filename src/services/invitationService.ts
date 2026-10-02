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
    acceptedAt?: string | null;
    createdAt: string;
}

export interface PaginationMeta {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
}

export interface PaginatedInvitationsResponse {
    data: Invitation[];
    meta: PaginationMeta;
}

export const invitationService = {
    /**
     * Envía una nueva invitación consumiendo el endpoint protegido del backend
     */
    createInvitation: async (data: CreateInvitationDto): Promise<any> => {
        const token = localStorage.getItem('accessToken');

        const response = await axios.post(`${API_URL}/invitations`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },

    /**
     * Obtiene la lista paginada de invitaciones existentes para mostrarlas en la tabla
     */
    getInvitations: async (page: number = 1, limit: number = 10): Promise<PaginatedInvitationsResponse> => {
        const token = localStorage.getItem('accessToken');

        const response = await axios.get(`${API_URL}/invitations`, {
            params: { page, limit },
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