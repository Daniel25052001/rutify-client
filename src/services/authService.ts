import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface RegisterDto {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken?: string;
    access_token?: string; // Soportamos ambos por seguridad
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authService = {
    async login(credentials: LoginDto): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        const token = response.data.accessToken || response.data.access_token;
        if (token) {
            localStorage.setItem('token', token);
        }
        return response.data;
    },

    async register(data: RegisterDto): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        const token = response.data.accessToken || response.data.access_token;
        if (token) {
            localStorage.setItem('token', token);
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    }
};