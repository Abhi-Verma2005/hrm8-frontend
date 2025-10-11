import { ReactNode } from 'react';
import { DashboardHeader } from './DashboardHeader';

interface DashboardPageLayoutProps {
  children: ReactNode;
  breadcrumbActions?: ReactNode;
}

export function DashboardPageLayout({ children, breadcrumbActions }: DashboardPageLayoutProps) {
  return (
    <>
      <DashboardHeader breadcrumbActions={breadcrumbActions} />
      <main className="flex-1">
        {children}
      </main>
    </>
  );
}
