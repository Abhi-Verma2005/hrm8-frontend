import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Globe,
  Linkedin,
  Users,
  Briefcase,
  Award,
} from 'lucide-react';
import type { Consultant } from '@/types/consultant';
import type { ConsultantMetrics } from '@/lib/consultantService';
import { format } from 'date-fns';
import { formatRelativeDate } from '@/lib/utils';

interface ConsultantProfileCardProps {
  consultant: Consultant;
  metrics: ConsultantMetrics;
}

export function ConsultantProfileCard({ consultant, metrics }: ConsultantProfileCardProps) {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Professional Profile</CardTitle>
        <Button variant="ghost" size="sm">
          Edit Profile →
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Professional Information */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            Professional Information
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Title:</span>
              <span className="text-sm font-medium">{consultant.title || 'Consultant'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Department:</span>
              <span className="text-sm font-medium">{consultant.department || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="text-sm font-medium">{consultant.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Phone:</span>
              <span className="text-sm font-medium">{consultant.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Location:</span>
              <span className="text-sm font-medium">
                {consultant.officeLocation || 'Remote'} 
                {consultant.city && `, ${consultant.city}`}
                {consultant.state && `, ${consultant.state}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Experience:</span>
              <span className="text-sm font-medium">{consultant.yearsOfExperience} years</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Specializations & Skills */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            Specializations
          </h4>
          <div className="flex flex-wrap gap-2">
            {consultant.specialization.map(spec => (
              <Badge key={spec} variant="secondary">{spec}</Badge>
            ))}
          </div>
          
          {consultant.certifications && consultant.certifications.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {consultant.certifications.map(cert => (
                  <Badge key={cert} variant="outline">{cert}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {consultant.languages && consultant.languages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Languages</p>
              <div className="flex flex-wrap gap-2">
                {consultant.languages.map(lang => (
                  <Badge key={lang} variant="outline">{lang}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Capacity & Limits */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            Capacity & Workload
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Employers</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {metrics.capacityUtilization.employers.current} / {metrics.capacityUtilization.employers.max}
                </span>
              </div>
              <Progress value={metrics.capacityUtilization.employers.percentage} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Active Jobs</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {metrics.capacityUtilization.jobs.current} / {metrics.capacityUtilization.jobs.max}
                </span>
              </div>
              <Progress value={metrics.capacityUtilization.jobs.percentage} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Employment Timeline */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
            Employment Timeline
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Hire Date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(consultant.hireDate)} ({metrics.daysEmployed < 365 ? 
                    `${Math.floor(metrics.daysEmployed / 30)} months` : 
                    `${Math.floor(metrics.daysEmployed / 365)} years`})
                </p>
              </div>
            </div>
            {consultant.reportingToName && (
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Reports To</p>
                  <p className="text-sm text-muted-foreground">{consultant.reportingToName}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Last Activity</p>
                <p className="text-sm text-muted-foreground">
                  {formatRelativeDate(metrics.lastActivityDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {(consultant.linkedInUrl || consultant.portfolioUrl || consultant.websiteUrl) && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                Links
              </h4>
              <div className="space-y-2">
                {consultant.linkedInUrl && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={consultant.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {consultant.websiteUrl && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={consultant.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Bio */}
        {consultant.bio && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                About
              </h4>
              <p className="text-sm text-muted-foreground">{consultant.bio}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
