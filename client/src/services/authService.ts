import { AuthResponse, LoginData, RegisterData, User } from '../types/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  }

  async verify(): Promise<{ valid: boolean; user?: User }> {
    const token = localStorage.getItem('token');
    if (!token) {
      return { valid: false };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        return { valid: false };
      }

      return await response.json();
    } catch (error) {
      localStorage.removeItem('token');
      return { valid: false };
    }
  }

  async getProfile(): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'failed to get profile');
    }

    return await response.json();
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export default new AuthService(); 