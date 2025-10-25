import { Mail, Phone, MapPin, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConsultantTypeBadge } from '../ConsultantTypeBadge';
import { ConsultantStatusBadge } from '../ConsultantStatusBadge';
import { getConsultantFullName, formatTenure } from '@/lib/consultantUtils';
import type { Consultant } from '@/types/consultant';
import { format } from 'date-fns';

interface ConsultantHeroSectionProps {
  consultant: Consultant;
}

export function ConsultantHeroSection({ consultant }: ConsultantHeroSectionProps) {
  return (
    <div className="border-b bg-card">
      <div className="px-6 py-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
              {consultant.firstName[0]}{consultant.lastName[0]}
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{getConsultantFullName(consultant)}</h1>
                <p className="text-lg text-muted-foreground mt-1">{consultant.title || 'Consultant'}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ConsultantTypeBadge type={consultant.type} />
                <ConsultantStatusBadge status={consultant.status} />
                {consultant.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {consultant.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{consultant.email}</span>
                  </div>
                )}
                {consultant.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{consultant.phone}</span>
                  </div>
                )}
                {consultant.officeLocation && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{consultant.officeLocation}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Hired {format(new Date(consultant.hireDate), 'MMM yyyy')} • {formatTenure(consultant.hireDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">Edit Profile</Button>
            <Button>Send Message</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
