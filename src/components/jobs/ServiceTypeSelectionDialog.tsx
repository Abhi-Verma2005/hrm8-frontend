import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceTypeSelectionDialogProps {
  open: boolean;
  onServiceTypeSelect: (serviceType: 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search') => void;
}

export function ServiceTypeSelectionDialog({ open, onServiceTypeSelect }: ServiceTypeSelectionDialogProps) {
  const [selectedService, setSelectedService] = useState<'self-managed' | 'hrm8' | null>(null);
  const [selectedHRM8Service, setSelectedHRM8Service] = useState<'shortlisting' | 'full-service' | 'executive-search' | null>(null);

  const handleContinue = () => {
    if (selectedService === 'self-managed') {
      onServiceTypeSelect('self-managed');
    } else if (selectedService === 'hrm8' && selectedHRM8Service) {
      onServiceTypeSelect(selectedHRM8Service);
    }
  };

  const canContinue = selectedService === 'self-managed' || (selectedService === 'hrm8' && selectedHRM8Service);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">How would you like to manage this hire?</DialogTitle>
          <DialogDescription>
            Select the service type that best fits your hiring needs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Main Service Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Self-Managed */}
            <Card
              className={cn(
                "p-6 cursor-pointer transition-all hover:border-primary border-2",
                selectedService === 'self-managed' ? "border-primary bg-primary/5" : "border-border"
              )}
              onClick={() => {
                setSelectedService('self-managed');
                setSelectedHRM8Service(null);
              }}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-lg",
                  selectedService === 'self-managed' ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Self-Managed</h3>
                    {selectedService === 'self-managed' && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manage the entire hiring process yourself using our platform's tools and features
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-3">
                    <li>• Full control over the process</li>
                    <li>• Access to all platform features</li>
                    <li>• Candidate sourcing and screening</li>
                    <li>• Interview management</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* HRM8 Recruitment Services */}
            <Card
              className={cn(
                "p-6 cursor-pointer transition-all hover:border-primary border-2",
                selectedService === 'hrm8' ? "border-primary bg-primary/5" : "border-border"
              )}
              onClick={() => setSelectedService('hrm8')}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-lg",
                  selectedService === 'hrm8' ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">HRM8 Recruitment Services</h3>
                    {selectedService === 'hrm8' && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Professional recruitment support from our expert team
                  </p>
                  <p className="text-sm font-medium text-foreground mt-3">
                    Choose a service level:
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* HRM8 Service Sub-options */}
          {selectedService === 'hrm8' && (
            <div className="space-y-3 pl-4 border-l-2 border-primary/30 animate-in slide-in-from-left">
              <h4 className="text-sm font-semibold text-muted-foreground">Select Service Level:</h4>
              
              <div className="space-y-2">
                <Card
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:border-primary border",
                    selectedHRM8Service === 'shortlisting' ? "border-primary bg-primary/5" : "border-border"
                  )}
                  onClick={() => setSelectedHRM8Service('shortlisting')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Shortlisting Service</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        We source and screen candidates, delivering a qualified shortlist
                      </p>
                    </div>
                    {selectedHRM8Service === 'shortlisting' && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0 ml-4" />
                    )}
                  </div>
                </Card>

                <Card
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:border-primary border",
                    selectedHRM8Service === 'full-service' ? "border-primary bg-primary/5" : "border-border"
                  )}
                  onClick={() => setSelectedHRM8Service('full-service')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Full Service</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        End-to-end recruitment from sourcing to offer management
                      </p>
                    </div>
                    {selectedHRM8Service === 'full-service' && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0 ml-4" />
                    )}
                  </div>
                </Card>

                <Card
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:border-primary border",
                    selectedHRM8Service === 'executive-search' ? "border-primary bg-primary/5" : "border-border"
                  )}
                  onClick={() => setSelectedHRM8Service('executive-search')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Executive Search</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Specialized search for senior leadership and executive roles
                      </p>
                    </div>
                    {selectedHRM8Service === 'executive-search' && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0 ml-4" />
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleContinue} 
              disabled={!canContinue}
              size="lg"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
