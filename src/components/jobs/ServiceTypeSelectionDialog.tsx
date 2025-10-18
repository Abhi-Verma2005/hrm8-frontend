import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Star, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceTypeSelectionDialogProps {
  open: boolean;
  onServiceTypeSelect: (serviceType: 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search') => void;
}

const services = [
  {
    id: 'self-managed' as const,
    name: 'Self-Managed',
    price: 'FREE',
    priceSubtext: 'Complete DIY',
    description: 'Full control over your recruitment process',
    features: [
      'Complete platform access',
      'All recruitment tools',
      'Candidate sourcing',
      'Interview management',
      'Your own timeline'
    ],
    icon: Briefcase,
    recommended: false,
    accent: 'slate'
  },
  {
    id: 'shortlisting' as const,
    name: 'Shortlisting Service',
    price: '$1,990',
    priceSubtext: 'Per hire',
    description: 'We find and screen the best candidates for you',
    features: [
      'Professional candidate sourcing',
      'Resume screening & evaluation',
      'Pre-qualified shortlist delivered',
      'Detailed candidate reports',
      'Quick turnaround time'
    ],
    icon: Users,
    recommended: false,
    accent: 'blue'
  },
  {
    id: 'full-service' as const,
    name: 'Full Service',
    price: '$5,990',
    priceSubtext: 'Per hire',
    description: 'Complete recruitment from start to finish',
    features: [
      'End-to-end recruitment support',
      'Interview coordination',
      'Candidate assessment & testing',
      'Offer negotiation support',
      'Dedicated account manager'
    ],
    icon: Star,
    recommended: true,
    accent: 'primary'
  },
  {
    id: 'executive-search' as const,
    name: 'Executive Search',
    price: 'From $9,990',
    priceSubtext: 'Per hire',
    description: 'Specialized search for leadership roles',
    features: [
      'Senior & C-level positions',
      'Confidential search process',
      'Market mapping & analysis',
      'Executive assessment',
      'Onboarding support'
    ],
    icon: Users,
    recommended: false,
    accent: 'gold'
  }
];

export function ServiceTypeSelectionDialog({ open, onServiceTypeSelect }: ServiceTypeSelectionDialogProps) {
  const [selectedService, setSelectedService] = useState<'self-managed' | 'shortlisting' | 'full-service' | 'executive-search' | null>(null);

  const handleContinue = () => {
    if (selectedService) {
      onServiceTypeSelect(selectedService);
    }
  };

  const selectedServiceDetails = services.find(s => s.id === selectedService);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader className="text-center space-y-3 pb-6">
          <DialogTitle className="text-3xl font-bold">Choose Your Recruitment Service</DialogTitle>
          <DialogDescription className="text-base">
            Select the service that best fits your hiring needs. Compare pricing and features at a glance.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;
            
            return (
              <Card
                key={service.id}
                className={cn(
                  "relative p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                  isSelected 
                    ? "border-2 border-primary bg-primary/5 shadow-md" 
                    : "border-2 border-border hover:border-primary/50"
                )}
                onClick={() => setSelectedService(service.id)}
              >
                {/* Recommended Badge */}
                {service.recommended && (
                  <Badge 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    RECOMMENDED
                  </Badge>
                )}

                <div className="space-y-4">
                  {/* Header with Icon and Title */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-3 rounded-lg",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{service.name}</h3>
                        <p className="text-xs text-muted-foreground">{service.priceSubtext}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="py-2">
                    <div className="text-4xl font-bold text-primary">{service.price}</div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground min-h-[40px]">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 pt-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select Button */}
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(service.id);
                    }}
                  >
                    {isSelected ? "Selected" : "Select This Service"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center pt-6 border-t">
          <Button 
            onClick={handleContinue} 
            disabled={!selectedService}
            size="lg"
            className="min-w-[320px] text-base h-12"
          >
            {selectedService 
              ? `Continue with ${selectedServiceDetails?.name}` 
              : 'Select a Service to Continue'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
