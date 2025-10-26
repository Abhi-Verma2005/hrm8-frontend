import { useState, useMemo } from "react";
import { X, Calendar, DollarSign, Plus, Trash2, UserPlus } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { createRPOService } from "@/lib/rpoServiceStorage";
import { RPOFeeStructure, ServicePriority } from "@/types/recruitmentService";
import { toast } from "sonner";
import { getEmployerById } from "@/lib/employerService";
import { COUNTRY_PHONE_CODES } from "@/lib/countryPhoneCodes";
import { getEmployerContacts } from "@/lib/employerContactStorage";

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
  
  const availableContacts = useMemo(() => {
    return getEmployerContacts(employerId);
  }, [employerId]);
  
  // Form state
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [primaryContactId, setPrimaryContactId] = useState("");
  const [additionalContactIds, setAdditionalContactIds] = useState<string[]>([]);
  
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("12");
  const [autoRenew, setAutoRenew] = useState(false);
  const [noticePeriod, setNoticePeriod] = useState("30");
  const [notes, setNotes] = useState("");
  
  const [feeStructures, setFeeStructures] = useState<RPOFeeStructure[]>([]);

  const totalSteps = 3;

  const resetForm = () => {
    setStep(1);
    setServiceName("");
    setDescription("");
    setCountry("");
    setPrimaryContactId("");
    setAdditionalContactIds([]);
    setStartDate("");
    setDuration("12");
    setAutoRenew(false);
    setNoticePeriod("30");
    setNotes("");
    setFeeStructures([]);
  };

  const handleAddFee = (fee: RPOFeeStructure) => {
    setFeeStructures([...feeStructures, fee]);
  };

  const handleRemoveFee = (feeId: string) => {
    setFeeStructures(feeStructures.filter(f => f.id !== feeId));
  };

  const calculateTotal = () => {
    return feeStructures.reduce((sum, fee) => {
      const amount = fee.amount;
      if (fee.frequency === 'monthly') {
        return sum + (amount * parseInt(duration));
      } else if (fee.frequency === 'quarterly') {
        return sum + (amount * Math.ceil(parseInt(duration) / 3));
      }
      return sum + amount;
    }, 0);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!serviceName.trim()) {
        toast.error("Please enter a service name");
        return;
      }
      if (!country) {
        toast.error("Please select a country");
        return;
      }
      if (!primaryContactId) {
        toast.error("Please select a primary contact");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreate = () => {
    if (feeStructures.length === 0) {
      toast.error("Please add at least one fee structure");
      return;
    }

    try {
      const primaryContact = availableContacts.find(c => c.id === primaryContactId);
      
      createRPOService({
        name: serviceName,
        description,
        priority: "medium",
        clientId: employerId,
        clientName: employer?.name || '',
        location: country,
        country: country,
        startDate,
        rpoDuration: parseInt(duration),
        rpoAutoRenew: autoRenew,
        rpoNoticePeriod: parseInt(noticePeriod),
        rpoNotes: notes,
        rpoFeeStructures: feeStructures,
        rpoPrimaryContactId: primaryContactId,
        rpoPrimaryContactName: primaryContact 
          ? `${primaryContact.firstName} ${primaryContact.lastName}` 
          : '',
        rpoAdditionalContactIds: additionalContactIds,
      });

      toast.success("RPO Service created successfully");
      resetForm();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create RPO service");
      console.error(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
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

        <ScrollArea className="flex-1 px-6 py-6">
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
                <Label htmlFor="country">Country *</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Object.keys(COUNTRY_PHONE_CODES)
                      .filter(c => c !== 'Other')
                      .sort()
                      .map(countryName => (
                        <SelectItem key={countryName} value={countryName}>
                          {countryName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryContact">Primary Contact *</Label>
                {availableContacts.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    No contacts available. Please add a contact first.
                  </div>
                ) : (
                  <>
                    <Select value={primaryContactId} onValueChange={setPrimaryContactId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableContacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {contact.firstName} {contact.lastName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {contact.title} • {contact.email}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {primaryContactId && (() => {
                      const contact = availableContacts.find(c => c.id === primaryContactId);
                      return contact ? (
                        <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1">
                          <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                          <div className="text-muted-foreground">{contact.title}</div>
                          <div className="text-muted-foreground">{contact.email}</div>
                          {contact.phone && <div className="text-muted-foreground">{contact.phone}</div>}
                        </div>
                      ) : null;
                    })()}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label>Additional Contacts (Optional)</Label>
                <Select 
                  value="" 
                  onValueChange={(value) => {
                    if (value && !additionalContactIds.includes(value)) {
                      setAdditionalContactIds([...additionalContactIds, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add additional contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableContacts
                      .filter(c => c.id !== primaryContactId && !additionalContactIds.includes(c.id))
                      .map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.firstName} {contact.lastName} - {contact.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                {additionalContactIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {additionalContactIds.map(contactId => {
                      const contact = availableContacts.find(c => c.id === contactId);
                      return contact ? (
                        <Badge key={contactId} variant="secondary" className="pl-3 pr-2 py-1.5">
                          <span>{contact.firstName} {contact.lastName}</span>
                          <button
                            type="button"
                            onClick={() => setAdditionalContactIds(
                              additionalContactIds.filter(id => id !== contactId)
                            )}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
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
                <Checkbox
                  id="autoRenew"
                  checked={autoRenew}
                  onCheckedChange={(checked) => setAutoRenew(checked as boolean)}
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
                <Label htmlFor="notes">Contract Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional contract terms or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 3: Fee Structure */}
          {step === 3 && (
            <div className="space-y-6">
              <FeeStructureForm onAddFee={handleAddFee} />

              {/* Fee List */}
              {feeStructures.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Fee Structures ({feeStructures.length})</h3>
                  {feeStructures.map((fee) => (
                    <div key={fee.id} className="border rounded-lg p-4">
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
                    </div>
                  ))}

                  <div className="border rounded-lg p-4 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total Contract Value</span>
                      <span className="text-2xl font-bold">
                        ${calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext}>
                Next
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

// Separate component for fee structure form
function FeeStructureForm({ onAddFee }: { onAddFee: (fee: RPOFeeStructure) => void }) {
  const [feeType, setFeeType] = useState<'monthly-retainer' | 'per-vacancy' | 'milestone' | 'custom'>('monthly-retainer');
  const [feeName, setFeeName] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [feeFrequency, setFeeFrequency] = useState<'one-time' | 'monthly' | 'quarterly' | 'per-placement'>('monthly');
  const [feeDescription, setFeeDescription] = useState('');

  const handleAdd = () => {
    if (!feeName || !feeAmount) {
      toast.error("Please enter fee name and amount");
      return;
    }

    const fee: RPOFeeStructure = {
      id: `fee_${Date.now()}`,
      type: feeType,
      name: feeName,
      amount: parseFloat(feeAmount),
      frequency: feeFrequency,
      description: feeDescription
    };

    onAddFee(fee);
    
    // Reset form
    setFeeName('');
    setFeeAmount('');
    setFeeDescription('');
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Add Fee Structure</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fee Type</Label>
            <Select value={feeType} onValueChange={(v: any) => setFeeType(v)}>
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
            <Select value={feeFrequency} onValueChange={(v: any) => setFeeFrequency(v)}>
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
              value={feeName}
              onChange={(e) => setFeeName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Amount ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description (optional)</Label>
          <Input
            placeholder="Additional details..."
            value={feeDescription}
            onChange={(e) => setFeeDescription(e.target.value)}
          />
        </div>

        <Button onClick={handleAdd} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Fee
        </Button>
      </div>
    </div>
  );
}