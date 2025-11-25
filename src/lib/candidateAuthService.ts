/**
 * Candidate Authentication Service
 * Handles candidate authentication-related API calls
 */

import { apiClient } from './api';

export interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photo?: string;
  linkedInUrl?: string;
  city?: string;
  state?: string;
  country?: string;
  emailVerified: boolean;
  status: string;
}

export interface CandidateLoginRequest {
  email: string;
  password: string;
}

export interface CandidateRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface CandidateLoginResponse {
  candidate: Candidate;
}

export interface CandidateRegisterResponse {
  candidate: Candidate;
  message: string;
}

class CandidateAuthService {
  async login(credentials: CandidateLoginRequest) {
    return apiClient.post<CandidateLoginResponse>('/api/candidate/auth/login', credentials);
  }

  async logout() {
    return apiClient.post('/api/candidate/auth/logout');
  }

  async register(data: CandidateRegisterRequest) {
    return apiClient.post<CandidateRegisterResponse>('/api/candidate/auth/register', data);
  }

  async getCurrentCandidate() {
    return apiClient.get<{ candidate: Candidate }>('/api/candidate/auth/me');
  }
}

export const candidateAuthService = new CandidateAuthService();

