
import { LoginRequest, RegisterRequest, AuthResponse } from './auth.model';
import {mutationBase} from '../../graphql/mutation'

export class AuthApi {
    private baseUrl = "/graphql";
    private token: string | null = null;

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        return response.json();
    }

    setToken(token: string) {
        this.token = token;
    }

    getHeaders() {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async login(request: LoginRequest): Promise<AuthResponse> {
        const loginMutation = mutationBase(
            "login",
            ["accessToken", "refreshToken"],
            { email: "String!", password: "String!" },  // Define expected GraphQL types
            "login"
        );    
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: loginMutation,
                variables: { email: request.email, password: request.password }
            })
        });
        const data = await this.handleResponse(response);
        this.setToken(data.token);
        return data;
    }

    async register(request: RegisterRequest): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(request)
        });
        const data = await this.handleResponse(response);
        this.setToken(data.token);
        return data;
    }

    async logout(): Promise<void> {
        await fetch(`${this.baseUrl}/logout`, {
            method: 'POST',
            headers: this.getHeaders()
        });
        this.token = null;
    }
}

export const authApi = new AuthApi();
