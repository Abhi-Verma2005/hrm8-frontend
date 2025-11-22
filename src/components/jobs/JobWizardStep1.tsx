import { UseFormReturn } from "react-hook-form";
import { JobFormData } from "@/types/job";
import { Link } from "react-router-dom";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileText, Building2, Check, DollarSign, MapPin, Briefcase as BriefcaseIcon, Plus } from "lucide-react";
import { ComboboxWithAdd } from "@/components/ui/combobox-with-add";
import { formatSalaryRange } from "@/lib/jobUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AddDepartmentDialog } from "@/components/jobs/AddDepartmentDialog";
import { AddLocationDialog } from "@/components/jobs/AddLocationDialog";
import { PositionDescriptionUpload } from "./PositionDescriptionUpload";
import { useToast } from "@/hooks/use-toast";
import { ServiceTypeSelector } from "./ServiceTypeSelector";
import { Separator } from "@/components/ui/separator";
interface JobWizardStep1Props {
  form: UseFormReturn<JobFormData>;
}
export function JobWizardStep1({
  form
}: JobWizardStep1Props) {
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const {
    toast
  } = useToast();
  const { user, profileSummary } = useAuth();
  
  // Get company name from user or profile
  const companyName = user?.companyName || profileSummary?.name || "Your Company";

  // Use default department and location options
  const defaultDepartments = ["Engineering", "Product", "Design", "Marketing", "Sales", "Finance", "Operations", "HR", "Customer Success", "Legal"];
  const defaultLocations = ["Remote"];

  const departmentOptions = defaultDepartments;
  const locationOptions = defaultLocations;
  const handleAddDepartment = (departmentData: any) => {
    const newDepartmentName = departmentData.name;
    form.setValue("department", newDepartmentName);
    toast({
      title: "Department added",
      description: `${newDepartmentName} has been added successfully.`
    });
  };
  const handleAddLocation = (locationData: any) => {
    const formattedLocationName = `${locationData.name}${locationData.city ? `, ${locationData.city}` : ''}`;
    form.setValue("location", formattedLocationName);
    toast({
      title: "Location added",
      description: `${formattedLocationName} has been added successfully.`
    });
  };
  return <div className="space-y-6">
      {/* Service Type Selection Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Choose Your Recruitment Service</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select the level of support you need from HRM8
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ServiceTypeSelector 
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-8" />

      {/* Basic Details Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5" />
            Basic Details
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Start by providing the essential information about this job
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/jobs/templates">
            <FileText className="h-4 w-4 mr-2" />
            View Templates
          </Link>
        </Button>
      </div>

      {/* Company Display - Read Only */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium">Posting Job For</p>
          <p className="text-lg font-semibold">{companyName}</p>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {/* Job Title - Takes most of the space */}
        <FormField control={form.control} name="title" render={({
        field
      }) => <FormItem className="flex-1">
              <FormLabel>Job Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Full Stack Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        {/* Number of Vacancies - Compact width */}
        <FormField control={form.control} name="numberOfVacancies" render={({
        field
      }) => <FormItem className="w-28">
              <FormLabel>Vacancies *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  max="999"
                  placeholder="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  className="text-center"
                />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="department" render={({
        field
      }) => <FormItem>
              <FormLabel>Department *</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <ComboboxWithAdd value={field.value} onValueChange={field.onChange} options={departmentOptions} placeholder="Select department" emptyText="No departments found." />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setDepartmentDialogOpen(true)}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription className="text-xs">
                Select or add a department for this job
              </FormDescription>
              <FormMessage />
            </FormItem>} />

        <FormField control={form.control} name="location" render={({
        field
      }) => <FormItem>
              <FormLabel>Location *</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <ComboboxWithAdd value={field.value} onValueChange={field.onChange} options={locationOptions} placeholder="Select location" emptyText="No locations found." />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setLocationDialogOpen(true)}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription className="text-xs">
                Select or add a location for this job
              </FormDescription>
              <FormMessage />
            </FormItem>} />
      </div>

      {/* Employment Details Row - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={form.control} name="employmentType" render={({
        field
      }) => <FormItem>
              <FormLabel>Employment Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>} />

        <FormField control={form.control} name="experienceLevel" render={({
        field
      }) => <FormItem>
              <FormLabel>Experience Level *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>} />

        <FormField control={form.control} name="workArrangement" render={({
        field
      }) => <FormItem>
              <FormLabel>Work Arrangement *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select arrangement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="on-site">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>On-site</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="remote">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Remote</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hybrid">
                    <div className="flex items-center gap-2">
                      <BriefcaseIcon className="h-4 w-4" />
                      <span>Hybrid</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                Where will this role be based?
              </FormDescription>
              <FormMessage />
            </FormItem>} />
      </div>

      {/* Salary Information Section */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Salary Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-start mb-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Salary Visibility on Job Board</h4>
            <p className="text-sm text-muted-foreground">
              Control whether salary information is displayed publicly on job boards. 
              Salary range is always used for filtering and internal tracking.
            </p>
          </div>
          
          <FormField control={form.control} name="hideSalary" render={({
          field
        }) => <FormItem className="flex flex-col justify-end">
                <FormLabel className="mb-2">Hide on Job Post</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-0 leading-none">
                    <FormLabel className="text-sm font-normal">
                      {field.value ? "Hidden" : "Visible"}
                    </FormLabel>
                  </div>
                </div>
                <FormDescription className="text-xs">
                  {field.value ? "Salary hidden from public view" : "Salary shown on job board"}
                </FormDescription>
              </FormItem>} />
        </div>

        <div className="space-y-4">
          {/* Salary Range & Currency Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField control={form.control} name="salaryCurrency" render={({
            field
          }) => <FormItem>
                  <FormLabel>Currency *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                        <SelectItem value="NZD">NZD (NZ$)</SelectItem>
                        <SelectItem value="SGD">SGD (S$)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />

            <FormField control={form.control} name="salaryPeriod" render={({
            field
          }) => <FormItem>
                  <FormLabel>Period *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Pay frequency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>} />

            <FormField control={form.control} name="salaryMin" render={({
            field
          }) => <FormItem>
                  <FormLabel>Minimum Salary *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g. 80,000" {...field} onChange={e => {
                const numericValue = e.target.value.replace(/,/g, '');
                if (numericValue === '' || /^\d+$/.test(numericValue)) {
                  field.onChange(numericValue ? Number(numericValue) : undefined);
                }
              }} value={field.value ? field.value.toLocaleString('en-US') : ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

            <FormField control={form.control} name="salaryMax" render={({
            field
          }) => <FormItem>
                  <FormLabel>Maximum Salary *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g. 120,000" {...field} onChange={e => {
                const numericValue = e.target.value.replace(/,/g, '');
                if (numericValue === '' || /^\d+$/.test(numericValue)) {
                  field.onChange(numericValue ? Number(numericValue) : undefined);
                }
              }} value={field.value ? field.value.toLocaleString('en-US') : ''} />
                    </FormControl>
                    <FormMessage />
                </FormItem>} />
          </div>

          {/* Salary Description Field */}
          <FormField control={form.control} name="salaryDescription" render={({
          field
        }) => <FormItem>
                <FormLabel>Salary Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Competitive package with bonuses, equity options, and benefits" maxLength={100} {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Add promotional text about compensation (max 100 characters). 
                    This will be displayed prominently on the job posting.
                    {field.value && <span className="ml-2 font-medium">
                        {field.value.length}/100
                      </span>}
                  </FormDescription>
                  <FormMessage />
                </FormItem>} />

          {/* Preview of formatted salary */}
          {(form.watch("salaryMin") || form.watch("salaryMax")) && <div className="p-4 bg-secondary/50 rounded-lg border">
              <p className="text-sm font-medium mb-1">Salary Display Preview:</p>
              <p className="text-lg font-semibold">
                {formatSalaryRange(form.watch("salaryMin"), form.watch("salaryMax"), form.watch("salaryCurrency"), form.watch("salaryPeriod"))}
              </p>
              {form.watch("salaryDescription") && <p className="text-sm text-muted-foreground mt-2 italic">
                  "{form.watch("salaryDescription")}"
                </p>}
            </div>}
        </div>
      </div>

      <PositionDescriptionUpload 
        form={form}
        onFileProcessed={(text) => {
          form.setValue("positionDescriptionText", text);
        }}
      />

      {/* Add Department Dialog */}
      <AddDepartmentDialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen} onAdd={handleAddDepartment} employerName={companyName} />

      {/* Add Location Dialog */}
      <AddLocationDialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen} onAdd={handleAddLocation} employerName={companyName} />
    </div>;
}