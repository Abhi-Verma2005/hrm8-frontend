import { UseFormReturn } from "react-hook-form";
import { JobFormData, HiringTeamMember } from "@/types/job";
import { useState } from "react";
import { format, addDays } from "date-fns";
import { CalendarIcon, Trash2, Users, Plus, Eye } from "lucide-react";
import { HiringTeamMemberCard } from "./HiringTeamMemberCard";
import { AddHiringTeamDialog } from "./AddHiringTeamDialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface JobWizardStep3Props {
  form: UseFormReturn<JobFormData>;
}

const TIMELINE_PRESETS = [
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
  { label: "28 days", days: 28 },
  { label: "45 days", days: 45 },
];

export function JobWizardStep3({ form }: JobWizardStep3Props) {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<HiringTeamMember | null>(null);

  const hiringTeam = form.watch('hiringTeam') || [];

  const handleAddTeamMember = (member: HiringTeamMember) => {
    if (editingMember) {
      // Update existing member
      form.setValue('hiringTeam', hiringTeam.map((m) => 
        m.id === member.id ? member : m
      ));
      setEditingMember(null);
    } else {
      // Add new member
      form.setValue('hiringTeam', [...hiringTeam, member]);
    }
  };

  const handleEditTeamMember = (member: HiringTeamMember) => {
    setEditingMember(member);
    setTeamDialogOpen(true);
  };

  const handleRemoveTeamMember = (memberId: string) => {
    form.setValue('hiringTeam', hiringTeam.filter((m) => m.id !== memberId));
  };
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Additional Details
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Set application deadline and visibility options
        </p>
      </div>

      <FormField
        control={form.control}
        name="closeDate"
        render={({ field }) => {
          const handlePresetSelect = (days: string) => {
            if (days === selectedPreset) {
              setSelectedPreset("");
              field.onChange("");
            } else {
              setSelectedPreset(days);
              const futureDate = addDays(new Date(), parseInt(days));
              field.onChange(format(futureDate, "yyyy-MM-dd"));
            }
          };

          const handleCalendarSelect = (date: Date | undefined) => {
            if (date) {
              field.onChange(format(date, "yyyy-MM-dd"));
              setSelectedPreset("");
              setShowCalendar(false);
            }
          };

          const handleClear = () => {
            setSelectedPreset("");
            field.onChange("");
          };

          return (
            <FormItem>
              <FormLabel>Application Deadline (Optional)</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <ToggleGroup 
                      type="single" 
                      value={selectedPreset}
                      onValueChange={handlePresetSelect}
                      className="gap-2"
                    >
                      {TIMELINE_PRESETS.map((preset) => (
                        <ToggleGroupItem
                          key={preset.days}
                          value={preset.days.toString()}
                          variant="outline"
                          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                          {preset.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>

                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={handleCalendarSelect}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>

                    {field.value && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleClear}
                        className="h-10 w-10 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {field.value && (
                    <div className="text-sm text-muted-foreground">
                      Selected: {format(new Date(field.value), "MMMM dd, yyyy")}
                      {selectedPreset && ` (${selectedPreset} days from now)`}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Leave blank if the position is open until filled
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <div className="space-y-4 pt-6 border-t">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Job Visibility
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Control who can see this job posting
          </p>
        </div>

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="sr-only">Job Visibility</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row gap-4"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="public" id="public" />
                    <label htmlFor="public" className="flex-1 cursor-pointer">
                      <div className="font-medium">Public</div>
                      <div className="text-sm text-muted-foreground">
                        Visible everywhere
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="private" id="private" />
                    <label htmlFor="private" className="flex-1 cursor-pointer">
                      <div className="font-medium">Private</div>
                      <div className="text-sm text-muted-foreground">
                        Only accessible via direct link
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-sm text-muted-foreground">
          Want to keep your hiring activity confidential? Activate <span className="font-semibold">STEALTH MODE</span>, and we will promote your vacancy under HRM8 branding to keep your company information private.
        </p>

        <FormField
          control={form.control}
          name="stealth"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-y-0">
              <div className="flex-1">
                <FormLabel className="font-medium">Stealth Mode</FormLabel>
                <FormDescription>
                  Company name hidden
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Hiring Team Section */}
      <div className="space-y-4 pt-6 border-t">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Hiring Team
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Assign team members who can manage applications
          </p>
        </div>

        {hiringTeam.length > 0 && (
          <div className="space-y-3">
            {hiringTeam.map((member) => (
              <HiringTeamMemberCard
                key={member.id}
                member={member}
                onRemove={handleRemoveTeamMember}
                onEdit={handleEditTeamMember}
              />
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingMember(null);
              setTeamDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>

      <AddHiringTeamDialog
        open={teamDialogOpen}
        onOpenChange={(open) => {
          setTeamDialogOpen(open);
          if (!open) setEditingMember(null);
        }}
        onAdd={handleAddTeamMember}
        editMember={editingMember}
      />
    </div>
  );
}
