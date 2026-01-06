/**
 * HRM8 Overview Dashboard
 * Main overview page for HRM8 Global Admin and Regional Licensees
 */

import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout';
import { MapPin, Users, Briefcase, DollarSign } from 'lucide-react';

export default function Hrm8Overview() {
  const { hrm8User } = useHrm8Auth();
  const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';

  return (
    <Hrm8PageLayout
      title="HRM8 Dashboard"
      subtitle={
        isGlobalAdmin
          ? 'Global overview of all regions, licensees, and consultants'
          : 'Regional overview of your assigned regions'
      }
    >
      <div className="p-6 space-y-6">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatCard
          title="Regions"
          value="-"
          icon={<MapPin className="h-6 w-6" />}
          variant="neutral"
        />

        <EnhancedStatCard
          title="Consultants"
          value="-"
          icon={<Users className="h-6 w-6" />}
          variant="primary"
        />

        <EnhancedStatCard
          title="Active Jobs"
          value="-"
          icon={<Briefcase className="h-6 w-6" />}
          variant="success"
        />

        <EnhancedStatCard
          title="Revenue"
          value=""
          isCurrency={true}
          rawValue={0}
          icon={<DollarSign className="h-6 w-6" />}
          variant="primary"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to HRM8 Admin Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is the HRM8 Global Admin dashboard. Use the sidebar to navigate to different sections.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            <strong>Note:</strong> This is a placeholder page. Full implementation will include:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
            <li>Region management and oversight</li>
            <li>Licensee management (Global Admin only)</li>
            <li>Consultant management and assignments</li>
            <li>Job allocation and tracking</li>
            <li>Commission and revenue tracking</li>
            <li>Comprehensive reporting and analytics</li>
          </ul>
        </CardContent>
      </Card>
      </div>
    </Hrm8PageLayout>
  );
}

