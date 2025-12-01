/**
 * Consultant Dashboard Layout
 * Main layout for consultants
 */

import { Outlet } from 'react-router-dom';
import { ConsultantLayout } from '@/components/layouts/ConsultantLayout';

export default function ConsultantDashboard() {
  return <ConsultantLayout />;
}

