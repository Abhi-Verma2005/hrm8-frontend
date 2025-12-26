import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Calendar, AlertCircle, ExternalLink, CheckCircle, Plus } from 'lucide-react';
import { getConsultantCertifications, getExpiringCertifications } from '@/lib/skillsStorage';
import { format, differenceInDays } from 'date-fns';

interface CertificationTrackingProps {
  consultantId: string;
}

export function CertificationTracking({ consultantId }: CertificationTrackingProps) {
  const certifications = getConsultantCertifications(consultantId);
  const expiring = getExpiringCertifications(consultantId, 90);

  if (certifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Award className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Certifications</h3>
          <p className="text-muted-foreground text-center mb-4">
            Track professional certifications and their renewal status
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'in-progress': return 'secondary';
      case 'expired': return 'destructive';
      default: return 'outline';
    }
  };

  const getExpiryWarning = (cert: any) => {
    if (!cert.expiryDate || cert.status !== 'active') return null;
    
    const daysUntilExpiry = differenceInDays(new Date(cert.expiryDate), new Date());
    
    if (daysUntilExpiry < 0) {
      return { severity: 'error', message: 'Expired', icon: AlertCircle, color: 'text-red-500' };
    } else if (daysUntilExpiry <= 30) {
      return { severity: 'critical', message: `Expires in ${daysUntilExpiry} days`, icon: AlertCircle, color: 'text-red-500' };
    } else if (daysUntilExpiry <= 90) {
      return { severity: 'warning', message: `Expires in ${daysUntilExpiry} days`, icon: AlertCircle, color: 'text-orange-500' };
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Expiring Soon Alert */}
      {expiring.length > 0 && (
        <Card className="border-orange-500/50 bg-orange-500/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Certifications Expiring Soon</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {expiring.length} certification(s) will expire within the next 90 days
                </p>
                <div className="space-y-2">
                  {expiring.map(cert => (
                    <div key={cert.id} className="flex items-center justify-between text-sm">
                      <span>{cert.name}</span>
                      <span className="text-orange-600 font-medium">
                        {cert.expiryDate && format(new Date(cert.expiryDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.map(cert => {
          const warning = getExpiryWarning(cert);
          
          return (
            <Card key={cert.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{cert.name}</h3>
                      <Badge variant={getStatusColor(cert.status)}>{cert.status}</Badge>
                      {cert.verified && (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                    {cert.description && (
                      <p className="text-sm text-muted-foreground mt-1">{cert.description}</p>
                    )}
                  </div>
                </div>

                {/* Expiry Warning */}
                {warning && (
                  <div className={`flex items-center gap-2 mb-4 p-3 border rounded ${
                    warning.severity === 'critical' || warning.severity === 'error' 
                      ? 'border-red-500/50 bg-red-500/10' 
                      : 'border-orange-500/50 bg-orange-500/10'
                  }`}>
                    <warning.icon className={`h-4 w-4 ${warning.color}`} />
                    <span className={`text-sm font-medium ${warning.color}`}>{warning.message}</span>
                  </div>
                )}

                {/* Dates & Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  {cert.issueDate && (
                    <div>
                      <span className="text-muted-foreground">Issued:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(cert.issueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  {cert.expiryDate && (
                    <div>
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(cert.expiryDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  {cert.credentialId && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Credential ID:</span>
                      <span className="ml-2 font-mono">{cert.credentialId}</span>
                    </div>
                  )}
                </div>

                {/* CPE Progress */}
                {cert.cpeRequired && cert.requiresRenewal && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">CPE Hours</span>
                      <span className="text-sm">
                        {cert.cpeCompleted || 0} / {cert.cpeRequired}
                      </span>
                    </div>
                    <Progress 
                      value={cert.cpeRequired > 0 ? ((cert.cpeCompleted || 0) / cert.cpeRequired) * 100 : 0} 
                    />
                  </div>
                )}

                {/* Related Skills */}
                {cert.relatedSkills.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Related Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {cert.relatedSkills.map(skillId => (
                        <Badge key={skillId} variant="outline" className="text-xs">
                          Skill #{skillId.slice(-4)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {cert.credentialUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Credential
                      </a>
                    </Button>
                  )}
                  {cert.certificateUrl && (
                    <Button variant="outline" size="sm">
                      View Certificate
                    </Button>
                  )}
                  {cert.requiresRenewal && cert.status === 'active' && (
                    <Button variant="default" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Renew
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
