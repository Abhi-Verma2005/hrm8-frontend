import { ReactNode } from 'react';
import { DashboardHeader } from './DashboardHeader';

interface DashboardPageLayoutProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  breadcrumbActions?: ReactNode;
}

export function DashboardPageLayout({ 
  title, 
  subtitle, 
  actions, 
  children, 
  breadcrumbActions 
}: DashboardPageLayoutProps) {
  return (
    <>
      <DashboardHeader breadcrumbActions={breadcrumbActions} />
      <div className="flex-1">
        {(title || subtitle || actions) && (
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container py-6">
              <div className="flex items-center justify-between">
                <div>
                  {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
                  {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
                </div>
                {actions && <div>{actions}</div>}
              </div>
            </div>
          </div>
        )}
        <div className="container py-6">
          {children}
        </div>
      </div>
    </>
  );
}
