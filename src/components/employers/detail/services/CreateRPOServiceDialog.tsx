import { useState, useMemo, useEffect } from "react";
import { X, Edit, Plus, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { createRPOService, updateRPOService } from "@/lib/rpoServiceStorage";
import { RPOFeeStructure } from "@/types/recruitmentService";
import { toast } from "sonner";
import { getEmployerById } from "@/lib/employerService";
import { COUNTRY_PHONE_CODES } from "@/lib/countryPhoneCodes";
import { getEmployerContacts } from "@/lib/employerContactStorage";
import { RPOFeeStructureBuilder } from "./RPOFeeStructureBuilder";
import { RPOTeamSelector } from "./RPOTeamSelector";

interface CreateRPOServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employerId: string;
  serviceId?: string; // If provided, dialog is in edit mode
  onSuccess?: () => void;
}

export function CreateRPOServiceDialog({
  open,
  onOpenChange,
  employerId,
  serviceId,
  onSuccess
}: CreateRPOServiceDialogProps) {
  const [step, setStep] = useState(1);
  
  const employer = getEmployerById(employerId);
  const isEditMode = !!serviceId;
  
  const availableContacts = useMemo(() => {
    return getEmployerContacts(employerId);
  }, [employerId]);
  
  // Step 1: Basic Info
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [primaryContactId, setPrimaryContactId] = useState("");
  const [additionalContactIds, setAdditionalContactIds] = useState<string[]>([]);
  
  // Step 2: Contract Terms
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("12");
  const [autoRenew, setAutoRenew] = useState(false);
  const [noticePeriod, setNoticePeriod] = useState("30");
  const [notes, setNotes] = useState("");
  
  // Step 3: Fee Structure
  const [feeStructures, setFeeStructures] = useState<RPOFeeStructure[]>([]);

  // Step 4: Team Allocation
  const [selectedConsultants, setSelectedConsultants] = useState<Array<{
    id: string;
    name: string;
    role: 'lead' | 'support';
    avatar?: string;
  }>>([]);

  // Step 5: Target Metrics
  const [targetPlacements, setTargetPlacements] = useState("");
  const [expectedRoles, setExpectedRoles] = useState("");
  const [targetTimeToFill, setTargetTimeToFill] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");

  const totalSteps = 6;

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
    setSelectedConsultants([]);
    setTargetPlacements("");
    setExpectedRoles("");
    setTargetTimeToFill("");
    setSuccessCriteria("");
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
    // Step 1 validation
    if (step === 1) {
      if (!serviceName.trim() || serviceName.length < 3) {
        toast.error("Service name must be at least 3 characters");
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
    
    // Step 2 validation
    if (step === 2) {
      if (!startDate) {
        toast.error("Please select a start date");
        return;
      }
      const durationNum = parseInt(duration);
      if (!durationNum || durationNum < 1 || durationNum > 60) {
        toast.error("Duration must be between 1 and 60 months");
        return;
      }
    }
    
    // Step 3 validation
    if (step === 3) {
      if (feeStructures.length === 0) {
        toast.error("Please add at least one fee structure");
        return;
      }
    }
    
    // Step 4 validation
    if (step === 4) {
      if (selectedConsultants.length === 0) {
        toast.error("Please select at least one consultant");
        return;
      }
      const hasLead = selectedConsultants.some(c => c.role === 'lead');
      if (!hasLead) {
        toast.error("At least one consultant must be assigned as Lead");
        return;
      }
    }
    
    // Step 5 validation
    if (step === 5) {
      const targetPlacementsNum = parseInt(targetPlacements);
      if (!targetPlacementsNum || targetPlacementsNum <= 0) {
        toast.error("Expected placements must be greater than 0");
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

  const handleJumpToStep = (targetStep: number) => {
    setStep(targetStep);
  };

  const handleCreate = () => {
    try {
      const primaryContact = availableContacts.find(c => c.id === primaryContactId);
      
      const serviceData = {
        name: serviceName,
        description,
        priority: "medium" as const,
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
        consultants: selectedConsultants,
        targetPlacements: parseInt(targetPlacements),
        requirements: expectedRoles.split(',').map(r => r.trim()).filter(Boolean),
      };

      if (isEditMode) {
        updateRPOService(serviceId, serviceData);
        toast.success("RPO Service updated successfully");
      } else {
        createRPOService(serviceData);
        toast.success("RPO Service created successfully");
      }

      resetForm();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error(isEditMode ? "Failed to update RPO service" : "Failed to create RPO service");
      console.error(error);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Basic Information";
      case 2: return "Contract Terms";
      case 3: return "Fee Structure";
      case 4: return "Team Allocation";
      case 5: return "Target Metrics";
      case 6: return "Review & Confirm";
      default: return "";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>{isEditMode ? "Edit" : "Create"} RPO Service</SheetTitle>
          <SheetDescription>
            Step {step} of {totalSteps}: {getStepTitle()}
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
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No contacts available. Please add a contact first.
                    </AlertDescription>
                  </Alert>
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
                        <Card>
                          <CardContent className="pt-4 space-y-1 text-sm">
                            <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                            <div className="text-muted-foreground">{contact.title}</div>
                            <div className="text-muted-foreground">{contact.email}</div>
                            {contact.phone && <div className="text-muted-foreground">{contact.phone}</div>}
                          </CardContent>
                        </Card>
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
                    if (value && !additionalContactIds.includes(value) && value !== primaryContactId) {
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

              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm">
                    <span className="font-semibold">Client:</span> {employer?.name}
                  </p>
                </CardContent>
              </Card>
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
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-sm">
                      <span className="font-semibold">End Date:</span>{' '}
                      {(() => {
                        const end = new Date(startDate);
                        end.setMonth(end.getMonth() + parseInt(duration));
                        return end.toLocaleDateString();
                      })()}
                    </p>
                  </CardContent>
                </Card>
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
              <RPOFeeStructureBuilder 
                fees={feeStructures} 
                onChange={setFeeStructures} 
              />
            </div>
          )}

          {/* Step 4: Team Allocation */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Assign Consultants</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select consultants to work on this RPO engagement. At least one must be assigned as Lead.
                </p>
              </div>
              
              <RPOTeamSelector
                selectedConsultants={selectedConsultants}
                onConsultantsChange={setSelectedConsultants}
                requireLead={true}
              />
            </div>
          )}

          {/* Step 5: Target Metrics */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Define Target Metrics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Set performance targets and success criteria for this RPO engagement.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetPlacements">Expected Placements *</Label>
                  <Input
                    id="targetPlacements"
                    type="number"
                    min="1"
                    placeholder="e.g., 25"
                    value={targetPlacements}
                    onChange={(e) => setTargetPlacements(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetTimeToFill">Target Time-to-Fill (days)</Label>
                  <Input
                    id="targetTimeToFill"
                    type="number"
                    min="1"
                    placeholder="e.g., 45"
                    value={targetTimeToFill}
                    onChange={(e) => setTargetTimeToFill(e.target.value)}
                  />
                </div>
              </div>

              {targetPlacements && duration && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <p className="text-sm">
                      <span className="font-semibold">Estimated placements per month:</span>{' '}
                      {(parseInt(targetPlacements) / parseInt(duration)).toFixed(1)}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="expectedRoles">Expected Roles</Label>
                <Textarea
                  id="expectedRoles"
                  placeholder="Enter roles separated by commas (e.g., Sales Manager, Account Executive, BDR)"
                  value={expectedRoles}
                  onChange={(e) => setExpectedRoles(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of roles you expect to recruit for
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="successCriteria">Success Criteria & KPIs</Label>
                <Textarea
                  id="successCriteria"
                  placeholder="Define what success looks like for this engagement..."
                  value={successCriteria}
                  onChange={(e) => setSuccessCriteria(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 6: Review & Confirm */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Review all details before {isEditMode ? "updating" : "creating"} the RPO service.
                </p>
              </div>

              {/* Basic Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">Basic Information</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleJumpToStep(1)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Service Name:</span>
                    <span className="font-medium">{serviceName}</span>
                    <span className="text-muted-foreground">Country:</span>
                    <span className="font-medium">{country}</span>
                    <span className="text-muted-foreground">Client:</span>
                    <span className="font-medium">{employer?.name}</span>
                  </div>
                  {description && (
                    <>
                      <Separator className="my-2" />
                      <div>
                        <span className="text-muted-foreground">Description:</span>
                        <p className="mt-1">{description}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contract Terms */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">Contract Terms</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleJumpToStep(2)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">{new Date(startDate).toLocaleDateString()}</span>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{duration} months</span>
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">
                      {(() => {
                        const end = new Date(startDate);
                        end.setMonth(end.getMonth() + parseInt(duration));
                        return end.toLocaleDateString();
                      })()}
                    </span>
                    <span className="text-muted-foreground">Auto-Renew:</span>
                    <span className="font-medium">{autoRenew ? 'Yes' : 'No'}</span>
                    <span className="text-muted-foreground">Notice Period:</span>
                    <span className="font-medium">{noticePeriod} days</span>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Structure */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">Fee Structure</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleJumpToStep(3)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {feeStructures.map((fee) => (
                    <div key={fee.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{fee.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{fee.type}</Badge>
                          <span>{fee.frequency}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        ${fee.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Contract Value</span>
                    <span className="text-primary">${calculateTotal().toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Team */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">Team ({selectedConsultants.length})</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleJumpToStep(4)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedConsultants.map((consultant) => (
                    <div key={consultant.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{consultant.name}</span>
                      <Badge variant={consultant.role === 'lead' ? 'default' : 'secondary'}>
                        {consultant.role}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Target Metrics */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">Target Metrics</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleJumpToStep(5)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Expected Placements:</span>
                    <span className="font-medium">{targetPlacements}</span>
                    {targetTimeToFill && (
                      <>
                        <span className="text-muted-foreground">Target Time-to-Fill:</span>
                        <span className="font-medium">{targetTimeToFill} days</span>
                      </>
                    )}
                  </div>
                  {expectedRoles && (
                    <>
                      <Separator className="my-2" />
                      <div>
                        <span className="text-muted-foreground">Expected Roles:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {expectedRoles.split(',').map((role, idx) => (
                            <Badge key={idx} variant="outline">{role.trim()}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contacts */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">Contacts</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleJumpToStep(1)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {(() => {
                    const primaryContact = availableContacts.find(c => c.id === primaryContactId);
                    return primaryContact ? (
                      <div>
                        <span className="text-muted-foreground">Primary Contact:</span>
                        <div className="mt-1 font-medium">
                          {primaryContact.firstName} {primaryContact.lastName} - {primaryContact.title}
                        </div>
                      </div>
                    ) : null;
                  })()}
                  {additionalContactIds.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Additional Contacts:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {additionalContactIds.map(contactId => {
                          const contact = availableContacts.find(c => c.id === contactId);
                          return contact ? (
                            <Badge key={contactId} variant="secondary">
                              {contact.firstName} {contact.lastName}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                {isEditMode ? "Save Changes" : "Create RPO Service"}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
