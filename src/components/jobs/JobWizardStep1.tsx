import { UseFormReturn } from "react-hook-form";
import { JobFormData } from "@/types/job";
import { Link } from "react-router-dom";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { FileText, Building2, Check, DollarSign, MapPin, Briefcase as BriefcaseIcon, Plus, X, Tag as TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ComboboxWithAdd } from "@/components/ui/combobox-with-add";
import { formatSalaryRange } from "@/lib/jobUtils";
import { getActiveEmployers, getDepartmentNames, getLocationNames } from "@/lib/employerService";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddDepartmentDialog } from "@/components/jobs/AddDepartmentDialog";
import { AddLocationDialog } from "@/components/jobs/AddLocationDialog";
import { useToast } from "@/hooks/use-toast";

const STANDARD_TAGS = [
  "Urgent",
  "Remote-first",
  "Hybrid",
  "Fast-track",
  "Equity included",
  "Relocation assistance",
  "Visa sponsorship",
  "Entry-level friendly",
  "Senior role",
  "Leadership position",
  "Contract-to-hire",
  "Flexible hours",
];

interface JobWizardStep1Props {
  form: UseFormReturn<JobFormData>;
}

export function JobWizardStep1({ form }: JobWizardStep1Props) {
  const [open, setOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const employers = getActiveEmployers();
  const selectedEmployerId = form.watch("employerId");
  const postAsHRM8 = form.watch("postAsHRM8");
  const selectedEmployer = employers.find(emp => emp.id === selectedEmployerId);

  // Get departments and locations from selected employer
  const employerDepartments = getDepartmentNames(selectedEmployer?.departments);
  const employerLocations = getLocationNames(selectedEmployer?.locations);

  // Fallback to common options if employer doesn't have specific ones
  const defaultDepartments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
    "HR",
    "Customer Success",
    "Legal",
  ];

  const defaultLocations = [
    "Remote",
    selectedEmployer?.location || "",
  ].filter(Boolean);

  // Use employer-specific or defaults
  const departmentOptions = employerDepartments.length > 0 ? employerDepartments : defaultDepartments;
  const locationOptions = employerLocations.length > 0 ? employerLocations : defaultLocations;

  const handleAddDepartment = (departmentData: any) => {
    const newDepartmentName = departmentData.name;
    form.setValue("department", newDepartmentName);
    toast({
      title: "Department added",
      description: `${newDepartmentName} has been added successfully.`,
    });
  };

  const handleAddLocation = (locationData: any) => {
    const formattedLocationName = `${locationData.name}${locationData.city ? `, ${locationData.city}` : ''}`;
    form.setValue("location", formattedLocationName);
    toast({
      title: "Location added",
      description: `${formattedLocationName} has been added successfully.`,
    });
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-start">
        <FormField
          control={form.control}
          name="employerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Post Job For *</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      disabled={postAsHRM8}
                      className={cn(
                        "justify-between font-normal",
                        !field.value && "text-muted-foreground",
                        postAsHRM8 && "opacity-50 cursor-not-allowed"
                      )}
                    >
                    {selectedEmployer ? (
                      <div className="flex items-center gap-2">
                        {selectedEmployer.logo ? (
                          <img src={selectedEmployer.logo} alt="" className="h-5 w-5 rounded" />
                        ) : (
                          <Building2 className="h-4 w-4" />
                        )}
                        <span>{selectedEmployer.name}</span>
                        <span className="text-xs text-muted-foreground">• {selectedEmployer.industry}</span>
                      </div>
                    ) : (
                      <>
                        <Building2 className="h-4 w-4 mr-2" />
                        Select employer company...
                      </>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search employers..." />
                  <CommandList>
                    <CommandEmpty>No employer found.</CommandEmpty>
                    <CommandGroup>
                      {employers.map((employer) => (
                        <CommandItem
                          key={employer.id}
                          value={`${employer.name} ${employer.industry} ${employer.location}`}
                          onSelect={() => {
                            form.setValue("employerId", employer.id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              employer.id === field.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            {employer.logo ? (
                              <img src={employer.logo} alt="" className="h-6 w-6 rounded" />
                            ) : (
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">{employer.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {employer.industry} • {employer.location}
                              </span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>
              Select employer company or toggle to post as HRM8
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

        <FormField
          control={form.control}
          name="postAsHRM8"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <FormLabel className="mb-2">Post as HRM8</FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        form.setValue("employerId", "");
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-0 leading-none">
                  <FormLabel className="text-sm font-normal">
                    {field.value ? "On" : "Off"}
                  </FormLabel>
                </div>
              </div>
              <FormDescription className="text-xs">
                Job posted as HRM8
              </FormDescription>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title *</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Senior Full Stack Developer" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department *</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <ComboboxWithAdd
                    value={field.value}
                    onValueChange={field.onChange}
                    options={departmentOptions}
                    placeholder="Select department"
                    emptyText="No departments found."
                    disabled={postAsHRM8}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline-primary"
                  size="icon"
                  onClick={() => {
                    if (!selectedEmployerId && !postAsHRM8) {
                      toast({
                        title: "Employer Required",
                        description: "Please select an employer or toggle 'Post as HRM8' before adding departments.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setDepartmentDialogOpen(true);
                  }}
                  title="Add new department"
                >
                  <Plus />
                </Button>
              </div>
              <FormDescription className="text-xs">
                {postAsHRM8 
                  ? "Select HRM8 department" 
                  : selectedEmployer 
                    ? `From ${selectedEmployer.name}'s departments` 
                    : "Select employer first to add departments"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location *</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <ComboboxWithAdd
                    value={field.value}
                    onValueChange={field.onChange}
                    options={locationOptions}
                    placeholder="Select location"
                    emptyText="No locations found."
                    disabled={postAsHRM8}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline-primary"
                  size="icon"
                  onClick={() => {
                    if (!selectedEmployerId && !postAsHRM8) {
                      toast({
                        title: "Employer Required",
                        description: "Please select an employer or toggle 'Post as HRM8' before adding locations.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setLocationDialogOpen(true);
                  }}
                  title="Add new location"
                >
                  <Plus />
                </Button>
              </div>
              <FormDescription className="text-xs">
                {postAsHRM8 
                  ? "Specify job location" 
                  : selectedEmployer 
                    ? `From ${selectedEmployer.name}'s office locations` 
                    : "Select employer first to add locations"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Employment Details Row - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem>
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workArrangement"
          render={({ field }) => (
            <FormItem>
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
            </FormItem>
          )}
        />
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
          
          <FormField
            control={form.control}
            name="hideSalary"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel className="mb-2">Hide on Job Board</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          {/* Salary Range & Currency Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="salaryCurrency"
              render={({ field }) => (
                <FormItem>
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
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="salaryPeriod"
              render={({ field }) => (
                <FormItem>
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
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="salaryMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Salary *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 80000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="salaryMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Salary *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 120000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Salary Description Field */}
          <FormField
            control={form.control}
            name="salaryDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Competitive package with bonuses, equity options, and benefits"
                      maxLength={100}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Add promotional text about compensation (max 100 characters). 
                    This will be displayed prominently on the job posting.
                    {field.value && (
                      <span className="ml-2 font-medium">
                        {field.value.length}/100
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

          {/* Preview of formatted salary */}
          {(form.watch("salaryMin") || form.watch("salaryMax")) && (
            <div className="p-4 bg-secondary/50 rounded-lg border">
              <p className="text-sm font-medium mb-1">Salary Display Preview:</p>
              <p className="text-lg font-semibold">
                {formatSalaryRange(
                  form.watch("salaryMin"), 
                  form.watch("salaryMax"), 
                  form.watch("salaryCurrency"),
                  form.watch("salaryPeriod")
                )}
              </p>
              {form.watch("salaryDescription") && (
                <p className="text-sm text-muted-foreground mt-2 italic">
                  "{form.watch("salaryDescription")}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags Section */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <TagIcon className="h-5 w-5" />
          Job Tags
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add up to 5 tags to categorize and highlight this job
        </p>
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => {
            const [inputValue, setInputValue] = useState("");
            const currentTags = field.value || [];
            
            const handleStandardTagClick = (tag: string) => {
              if (currentTags.length >= 5) {
                toast({
                  title: "Maximum tags reached",
                  description: "You can only add up to 5 tags per job",
                  variant: "destructive",
                });
                return;
              }
              
              if (currentTags.includes(tag)) {
                return;
              }
              
              field.onChange([...currentTags, tag]);
            };
            
            const handleAddTag = () => {
              const trimmedValue = inputValue.trim();
              if (!trimmedValue) return;
              
              if (currentTags.length >= 5) {
                toast({
                  title: "Maximum tags reached",
                  description: "You can only add up to 5 tags per job",
                  variant: "destructive",
                });
                return;
              }
              
              if (currentTags.includes(trimmedValue)) {
                toast({
                  title: "Duplicate tag",
                  description: "This tag has already been added",
                  variant: "destructive",
                });
                return;
              }
              
              if (trimmedValue.length > 20) {
                toast({
                  title: "Tag too long",
                  description: "Tags must be 20 characters or less",
                  variant: "destructive",
                });
                return;
              }
              
              field.onChange([...currentTags, trimmedValue]);
              setInputValue("");
            };
            
            const handleRemoveTag = (tagToRemove: string) => {
              field.onChange(currentTags.filter((tag: string) => tag !== tagToRemove));
            };
            
            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            };
            
            return (
              <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <FormDescription>
                  Add up to 5 tags to categorize and highlight this job
                </FormDescription>
                
                <div className="space-y-4 mt-3">
                  {/* Standard Tags Section */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Quick Add: Standard Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {STANDARD_TAGS.map((tag) => {
                        const isAdded = currentTags.includes(tag);
                        const isDisabled = isAdded || currentTags.length >= 5;
                        
                        return (
                          <Button
                            key={tag}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 text-sm transition-all",
                              isAdded && "opacity-50 cursor-not-allowed",
                              !isAdded && !isDisabled && "hover:bg-muted",
                              tag.toLowerCase() === 'urgent' && !isAdded && "text-destructive hover:text-destructive"
                            )}
                            onClick={() => !isDisabled && handleStandardTagClick(tag)}
                            disabled={isDisabled}
                          >
                            {isAdded && <Check className="h-3 w-3 mr-1" />}
                            {tag}
                          </Button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click any tag to add it to your job posting
                    </p>
                  </div>
                  
                  {/* Custom Tags Section */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Add Custom Tag</h4>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder='e.g., "Tech stack specific", "Benefits highlight"'
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          maxLength={20}
                          disabled={currentTags.length >= 5}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddTag}
                        disabled={!inputValue.trim() || currentTags.length >= 5}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Create custom tags not in the standard list (max 20 characters)
                    </p>
                  </div>
                  
                  {/* Selected Tags Display */}
                  {currentTags.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Selected Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentTags.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant={tag.toLowerCase() === 'urgent' ? 'destructive' : 'secondary'}
                            className="px-3 py-1 text-sm flex items-center gap-2"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:bg-background/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Counter */}
                  <p className="text-sm text-muted-foreground">
                    {currentTags.length}/5 tags added
                    {currentTags.length >= 5 && " (maximum reached)"}
                  </p>
                </div>
                
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      {/* Add Department Dialog */}
      <AddDepartmentDialog
        open={departmentDialogOpen}
        onOpenChange={setDepartmentDialogOpen}
        onAdd={handleAddDepartment}
        employerName={selectedEmployer?.name}
      />

      {/* Add Location Dialog */}
      <AddLocationDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        onAdd={handleAddLocation}
        employerName={selectedEmployer?.name}
      />
    </div>
  );
}
