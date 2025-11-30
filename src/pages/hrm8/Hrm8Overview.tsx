/**
 * HRM8 Overview Dashboard
 * Main overview page for HRM8 Global Admin and Regional Licensees
 */

import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Briefcase, DollarSign } from 'lucide-react';

export default function Hrm8Overview() {
  const { hrm8User } = useHrm8Auth();
  const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HRM8 Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          {isGlobalAdmin
            ? 'Global overview of all regions, licensees, and consultants'
            : 'Regional overview of your assigned regions'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Total regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Active consultants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Jobs in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>
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
  );
}

