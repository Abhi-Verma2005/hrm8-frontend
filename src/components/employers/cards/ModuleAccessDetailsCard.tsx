import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Employer } from "@/types/entities";
import { getAvailableModules, getModuleCategories } from "@/lib/moduleAccessControl";
import { CheckCircle2, Lock } from "lucide-react";

interface ModuleAccessDetailsCardProps {
  employer: Employer;
}

export function ModuleAccessDetailsCard({ employer }: ModuleAccessDetailsCardProps) {
  const availableModules = getAvailableModules(employer.subscriptionTier, employer.modules);
  const categories = getModuleCategories();

  const moduleLabels: Record<string, string> = {
    'ats.dashboard': 'Dashboard',
    'ats.jobs': 'Job Management',
    'ats.candidates': 'Candidate Management',
    'ats.applications': 'Application Tracking',
    'ats.interviews': 'Interview Scheduling',
    'ats.offers': 'Offer Management',
    'ats.talent-pool': 'Talent Pool',
    'ats.careers-page': 'Branded Careers Page',
    'ats.job-boards': 'Job Board Integration',
    'ats.reports': 'Reports & Analytics',
    'ats.ai-screening': 'AI Screening',
    'ats.custom-forms': 'Custom Forms',
    'ats.team-collaboration': 'Team Collaboration',
    'ats.location-manager': 'Location Manager',
    'ats.department-manager': 'Department Manager',
    'ats.division-manager': 'Division Manager',
    'hrms.dashboard': 'HRMS Dashboard',
    'hrms.employees': 'Employee Management',
    'hrms.attendance': 'Attendance Tracking',
    'hrms.leave': 'Leave Management',
    'hrms.performance': 'Performance Reviews',
    'hrms.payroll': 'Payroll Management',
    'hrms.benefits': 'Benefits Administration',
    'hrms.documents': 'Document Management',
    'hrms.org-chart': 'Organization Chart',
    'hrms.self-service': 'Employee Self-Service',
    'hrms.reports': 'HR Reports',
    'addon.assessments': 'Skills Assessments',
    'addon.reference-checking': 'Reference Checking',
    'addon.video-interviewing': 'Video Interviewing',
  };

  const renderCategoryModules = (categoryModules: string[], categoryName: string) => {
    const activeModules = categoryModules.filter(m => availableModules.includes(m as any));
    const inactiveModules = categoryModules.filter(m => !availableModules.includes(m as any));

    return (
      <div className="space-y-2">
        {activeModules.map(module => (
          <div key={module} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>{moduleLabels[module] || module}</span>
          </div>
        ))}
        {inactiveModules.map(module => (
          <div key={module} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>{moduleLabels[module] || module}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Access Details</CardTitle>
        <CardDescription>
          Detailed breakdown of available features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ATS Modules */}
        {employer.modules.atsEnabled && (
          <>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">ATS Core Modules</h4>
                <Badge variant="outline">
                  {categories.atsCore.modules.filter(m => availableModules.includes(m)).length}/{categories.atsCore.modules.length}
                </Badge>
              </div>
              {renderCategoryModules(categories.atsCore.modules, 'ATS Core')}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">ATS Advanced Features</h4>
                <Badge variant="outline">
                  {categories.atsAdvanced.modules.filter(m => availableModules.includes(m)).length}/{categories.atsAdvanced.modules.length}
                </Badge>
              </div>
              {renderCategoryModules(categories.atsAdvanced.modules, 'ATS Advanced')}
            </div>
          </>
        )}

        {/* HRMS Modules */}
        {employer.modules.hrmsEnabled && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">HRMS Modules</h4>
              <Badge variant="outline">
                {categories.hrms.modules.filter(m => availableModules.includes(m)).length}/{categories.hrms.modules.length}
              </Badge>
            </div>
            {renderCategoryModules(categories.hrms.modules, 'HRMS')}
          </div>
        )}

        {/* Add-ons */}
        {employer.modules.enabledAddons.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Add-on Services</h4>
              <Badge variant="outline">
                {categories.addons.modules.filter(m => availableModules.includes(m)).length}/{categories.addons.modules.length}
              </Badge>
            </div>
            {renderCategoryModules(categories.addons.modules, 'Add-ons')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
