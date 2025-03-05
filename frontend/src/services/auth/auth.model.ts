import { authApi } from './auth.api';

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    email: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const model = {
    api: authApi
};