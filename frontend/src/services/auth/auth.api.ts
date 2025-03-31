import { LoginRequest, RegisterRequest, AuthResponse, User } from './auth.model';
import { mutationBase } from '../../graphql/mutation';
import { queryBase } from '../../graphql/query';

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
        localStorage.setItem('accessToken', token);
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('accessToken');
        }
        return this.token;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('accessToken');
    }

    getHeaders() {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async login(request: LoginRequest): Promise<AuthResponse> {
        const loginMutation = mutationBase(
            "login",
            ["accessToken", "refreshToken"],
            { email: "String!", password: "String!" },
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
        console.log(response)
        const data = await this.handleResponse(response);
        console.log(data)
        if (data.data?.login?.accessToken) {
            this.setToken(data.data.login.accessToken);
            // Fetch user data after successful login
            const user = await this.getCurrentUser(data.data.login.accessToken);
            return { ...data, user };
        }
        return data;
    }

    async register(request: RegisterRequest): Promise<AuthResponse> {
        const registerMutation = mutationBase(
            "register",
            ["email", "firstName", "lastName"],
            { userData: "UserInput!" },
            "register"
        );
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: registerMutation,
                variables: { userData: {email: request.email, password: request.password, firstName: request.firstName, lastName: request.lastName }}
            })
        });
        const data = await this.handleResponse(response);
        if (data.data?.register?.accessToken) {
            this.setToken(data.data.register.accessToken);
            // Fetch user data after successful registration
            const user = await this.getCurrentUser();
            return { ...data, user };
        }
        return data;
    }

    async getCurrentUser(token: string): Promise<User> {
        const meQuery = queryBase(
            "me",
            "me",
            ["id", "email", "firstName", "lastName"],
            {token:{type: "String!", value: token}},
        );
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: meQuery,
                variables: {token:token}
            })
        });
        const data = await this.handleResponse(response);
        return data.data.me;
    }

    async logout(): Promise<void> {
        this.clearToken();
    }
}

export const authApi = new AuthApi();
