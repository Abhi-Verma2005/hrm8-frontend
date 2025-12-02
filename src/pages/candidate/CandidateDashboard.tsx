/**
 * Candidate Dashboard
 * Main dashboard layout for candidates
 */

import { Outlet } from 'react-router-dom';
import { CandidateAuthGuard } from '@/components/auth/CandidateAuthGuard';
import { CandidateLayout } from '@/components/layouts/CandidateLayout';

export default function CandidateDashboard() {
  return (
    <CandidateAuthGuard>
      <CandidateLayout />
    </CandidateAuthGuard>
  );
}

