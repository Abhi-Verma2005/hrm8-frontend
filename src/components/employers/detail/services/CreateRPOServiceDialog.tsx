import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, X, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createRPOService, calculateRPOContractValue } from "@/lib/rpoServiceStorage";
import { getEmployerById } from "@/lib/employerService";
import type { RPOFeeStructure, ServicePriority } from "@/types/recruitmentService";

interface CreateRPOServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employerId: string;
  onSuccess?: () => void;
}

export function CreateRPOServiceDialog({
  open,
  onOpenChange,
  employerId,
  onSuccess
}: CreateRPOServiceDialogProps) {
  const [step, setStep] = useState(1);
  const employer = getEmployerById(employerId);
  
  // Form state
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("12");
  const [autoRenew, setAutoRenew] = useState(false);
  const [noticePeriod, setNoticePeriod] = useState("30");
  const [contractNotes, setContractNotes] = useState("");
  
  const [feeStructures, setFeeStructures] = useState<RPOFeeStructure[]>([]);
  const [newFee, setNewFee] = useState({
    type: 'monthly-retainer' as const,
    name: '',
    amount: '',
    frequency: 'monthly' as const,
    description: ''
  });

  const totalSteps = 3;

  const resetForm = () => {
    setStep(1);
    setServiceName("");
    setDescription("");
    setLocation("");
    setStartDate("");
    setDuration("12");
    setAutoRenew(false);
    setNoticePeriod("30");
    setContractNotes("");
    setFeeStructures([]);
    setNewFee({
      type: 'monthly-retainer',
      name: '',
      amount: '',
      frequency: 'monthly',
      description: ''
    });
  };

  const handleAddFee = () => {
    if (!newFee.name || !newFee.amount) {
      toast({
        title: "Missing Information",
        description: "Please enter fee name and amount",
        variant: "destructive"
      });
      return;
    }

    const fee: RPOFeeStructure = {
      id: `fee_${Date.now()}`,
      type: newFee.type,
      name: newFee.name,
      amount: parseFloat(newFee.amount),
      frequency: newFee.frequency,
      description: newFee.description
    };

    setFeeStructures([...feeStructures, fee]);
    setNewFee({
      type: 'monthly-retainer',
      name: '',
      amount: '',
      frequency: 'monthly',
      description: ''
    });
  };

  const handleRemoveFee = (feeId: string) => {
    setFeeStructures(feeStructures.filter(f => f.id !== feeId));
  };

  const calculateTotal = () => {
    if (feeStructures.length === 0) return 0;
    return calculateRPOContractValue(feeStructures, parseInt(duration) || 12);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!serviceName.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter a service name",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (step === 2) {
      if (!startDate || !duration) {
        toast({
          title: "Missing Information",
          description: "Please enter start date and duration",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreate = () => {
    if (feeStructures.length === 0) {
      toast({
        title: "Missing Fee Structure",
        description: "Please add at least one fee structure",
        variant: "destructive"
      });
      return;
    }

    try {
      createRPOService({
        name: serviceName,
        description,
        priority: "medium",
        clientId: employerId,
        clientName: employer?.name || '',
        location: location || employer?.location || '',
        country: 'United States',
        rpoStartDate: startDate,
        rpoDuration: parseInt(duration),
        rpoAutoRenew: autoRenew,
        rpoNoticePeriod: parseInt(noticePeriod),
        rpoNotes: contractNotes,
        rpoFeeStructures: feeStructures,
        consultants: [],
        candidatesShortlisted: 0,
        candidatesInterviewed: 0,
        numberOfVacancies: 0,
        targetPlacements: 0
      });

      toast({
        title: "RPO Service Created",
        description: `${serviceName} has been created successfully`
      });

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create RPO service",
        variant: "destructive"
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Create RPO Service</SheetTitle>
          <SheetDescription>
            Step {step} of {totalSteps}: {
              step === 1 ? "Basic Information" :
              step === 2 ? "Contract Terms" :
              "Fee Structure"
            }
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="px-6 py-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service Name *</Label>
                  <Input
                    id="serviceName"
                    placeholder="e.g., Regional Sales Expansion RPO"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the RPO engagement..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location/Region</Label>
                  <Input
                    id="location"
                    placeholder="e.g., New York, NY"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Client:</span> {employer?.name}
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Contract Terms */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (months) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="60"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>

                {startDate && duration && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold">End Date:</span>{' '}
                      {(() => {
                        const end = new Date(startDate);
                        end.setMonth(end.getMonth() + parseInt(duration));
                        return end.toLocaleDateString();
                      })()}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoRenew"
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="autoRenew" className="cursor-pointer">
                    Auto-renew contract
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noticePeriod">Notice Period (days)</Label>
                  <Input
                    id="noticePeriod"
                    type="number"
                    min="0"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractNotes">Contract Notes</Label>
                  <Textarea
                    id="contractNotes"
                    placeholder="Additional contract terms or notes..."
                    value={contractNotes}
                    onChange={(e) => setContractNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Fee Structure */}
            {step === 3 && (
              <div className="space-y-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Add Fee Structure</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fee Type</Label>
                        <Select 
                          value={newFee.type} 
                          onValueChange={(v: any) => setNewFee({...newFee, type: v})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly-retainer">Monthly Retainer</SelectItem>
                            <SelectItem value="per-vacancy">Per Vacancy</SelectItem>
                            <SelectItem value="milestone">Milestone</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select 
                          value={newFee.frequency} 
                          onValueChange={(v: any) => setNewFee({...newFee, frequency: v})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one-time">One-time</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="per-placement">Per Placement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fee Name</Label>
                        <Input
                          placeholder="e.g., Monthly Retainer"
                          value={newFee.name}
                          onChange={(e) => setNewFee({...newFee, name: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Amount ($)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={newFee.amount}
                          onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description (optional)</Label>
                      <Input
                        placeholder="Additional details..."
                        value={newFee.description}
                        onChange={(e) => setNewFee({...newFee, description: e.target.value})}
                      />
                    </div>

                    <Button onClick={handleAddFee} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Fee
                    </Button>
                  </div>
                </Card>

                {/* Fee List */}
                {feeStructures.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Fee Structures ({feeStructures.length})</h3>
                    {feeStructures.map((fee) => (
                      <Card key={fee.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{fee.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {fee.type.replace('-', ' ')}
                              </Badge>
                            </div>
                            <div className="text-2xl font-bold">
                              ${fee.amount.toLocaleString()}
                              {fee.frequency && fee.frequency !== 'one-time' && (
                                <span className="text-sm text-muted-foreground ml-2">
                                  / {fee.frequency}
                                </span>
                              )}
                            </div>
                            {fee.description && (
                              <p className="text-sm text-muted-foreground">{fee.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFee(fee.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}

                    <Card className="p-4 bg-primary/5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Total Contract Value</span>
                        <span className="text-2xl font-bold">
                          ${calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleCreate}>
                Create RPO Service
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
