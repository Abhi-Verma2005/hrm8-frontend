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
import { FileText, Building2, Check } from "lucide-react";
import { getActiveEmployers } from "@/lib/employerService";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface JobWizardStep1Props {
  form: UseFormReturn<JobFormData>;
}

export function JobWizardStep1({ form }: JobWizardStep1Props) {
  const [open, setOpen] = useState(false);
  const employers = getActiveEmployers();
  const selectedEmployerId = form.watch("employerId");
  const postAsHRM8 = form.watch("postAsHRM8");
  const selectedEmployer = employers.find(emp => emp.id === selectedEmployerId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Basic Details</h2>
          <p className="text-muted-foreground mt-1">
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
                Post as HRM8
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
              <FormControl>
                <Input placeholder="e.g. Engineering" {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder="e.g. San Francisco, CA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Urgent jobs will be highlighted to attract more attention
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remoteOption"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <div className="flex items-center space-x-2 py-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remote work available</FormLabel>
                  <FormDescription>
                    This position offers remote work options
                  </FormDescription>
                </div>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
