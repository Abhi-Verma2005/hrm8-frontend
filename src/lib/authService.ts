/**
 * Authentication Service
 * Handles authentication-related API calls
 */

import { apiClient } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId: string;
  companyName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface RegisterCompanyRequest {
  companyName: string;
  companyWebsite: string;
  adminEmail: string;
  adminName: string;
  password: string;
}

export interface RegisterCompanyResponse {
  companyId: string;
  adminUserId: string;
  verificationRequired: boolean;
  verificationMethod: string;
  message: string;
}

class AuthService {
  async login(credentials: LoginRequest) {
    return apiClient.post<LoginResponse>('/api/auth/login', credentials);
  }

  async logout() {
    return apiClient.post('/api/auth/logout');
  }

  async registerCompany(data: RegisterCompanyRequest) {
    return apiClient.post<RegisterCompanyResponse>('/api/auth/register/company', data);
  }

  async getCurrentUser() {
    return apiClient.get<{ user: User }>('/api/auth/me');
  }
}

export const authService = new AuthService();

