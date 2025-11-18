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

export interface VerifyCompanyRequest {
  token: string;
  companyId: string;
}

export interface VerifyCompanyResponse {
  message: string;
  email?: string;
  user?: User;
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

  async verifyCompany(data: VerifyCompanyRequest) {
    return apiClient.post<VerifyCompanyResponse>('/api/auth/verify-company', data);
  }

  async employeeSignup(data: {
    email: string;
    name: string;
    password: string;
    companyDomain?: string;
  }) {
    return apiClient.post<{ requestId: string; message: string }>('/api/auth/signup', data);
  }

  async acceptInvitation(data: {
    token: string;
    password: string;
    name: string;
  }) {
    return apiClient.post<{ userId: string; message: string }>('/api/auth/accept-invitation', data);
  }
}

export const authService = new AuthService();

