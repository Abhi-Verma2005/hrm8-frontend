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
    price: '$9,990 | $14,990',
    priceSubtext: '≤$100k | >$100k salary',
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader className="text-center space-y-3 pb-4">
          <DialogTitle className="text-3xl font-bold">Choose Your Recruitment Service</DialogTitle>
          <DialogDescription className="text-base">
            Compare pricing and features to find the perfect fit for your hiring needs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;
            
            return (
              <Card
                key={service.id}
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all duration-200",
                  "border-l-4 px-6 py-5 hover:bg-muted/30 hover:scale-[1.01]",
                  isSelected 
                    ? "border-l-primary bg-primary/5 shadow-md" 
                    : "border-l-transparent hover:border-l-primary/50"
                )}
                onClick={() => setSelectedService(service.id)}
              >
                {/* Recommended Badge */}
                {service.recommended && (
                  <Badge 
                    className="absolute top-3 right-3 bg-primary text-primary-foreground"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    MOST POPULAR
                  </Badge>
                )}

                {/* Selection Check Icon */}
                {isSelected && !service.recommended && (
                  <div className="absolute top-3 right-3">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}

                {/* Main Content - Horizontal Layout */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  
                  {/* Left: Icon + Name + Description */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={cn(
                      "p-3 rounded-lg flex-shrink-0",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Center: Price */}
                  <div className="text-center lg:min-w-[200px] flex-shrink-0">
                    <div className="text-3xl font-bold text-primary">
                      {service.price}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {service.priceSubtext}
                    </div>
                  </div>

                  {/* Right: Features */}
                  <div className="flex-1 lg:max-w-[280px] w-full">
                    <div className="grid grid-cols-1 gap-1.5">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground leading-tight">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

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
