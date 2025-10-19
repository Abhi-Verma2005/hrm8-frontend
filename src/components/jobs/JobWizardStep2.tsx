import { UseFormReturn } from "react-hook-form";
import { JobFormData } from "@/types/job";
import { useState, useRef } from "react";
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
import { Plus, X, FileText, Pencil, Trash2, Check, Tag as TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AIJobGenerator } from "./AIJobGenerator";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface JobWizardStep2Props {
  form: UseFormReturn<JobFormData>;
}

const STANDARD_TAGS = ["Urgent", "Remote-first", "Hybrid", "Fast-track", "Equity included", "Relocation assistance", "Visa sponsorship", "Entry-level friendly", "Senior role", "Leadership position", "Contract-to-hire", "Flexible hours"];
const getTagVariant = (tag: string): "destructive" | "info" | "purple" | "amber" | "teal" | "indigo" | "secondary" => {
  const tagLower = tag.toLowerCase();
  if (tagLower === 'urgent' || tagLower === 'fast-track') return 'destructive';
  if (tagLower === 'remote-first' || tagLower === 'flexible hours') return 'info';
  if (tagLower === 'hybrid') return 'purple';
  if (tagLower === 'equity included' || tagLower === 'relocation assistance' || tagLower === 'visa sponsorship') return 'amber';
  if (tagLower === 'entry-level friendly' || tagLower === 'senior role' || tagLower === 'leadership position') return 'teal';
  if (tagLower === 'contract-to-hire') return 'indigo';
  return 'secondary';
};

export function JobWizardStep2({ form }: JobWizardStep2Props) {
  const { toast } = useToast();
  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");
  const [editingRequirementIndex, setEditingRequirementIndex] = useState<number | null>(null);
  const [editingRequirementText, setEditingRequirementText] = useState("");
  const [editingResponsibilityIndex, setEditingResponsibilityIndex] = useState<number | null>(null);
  const [editingResponsibilityText, setEditingResponsibilityText] = useState("");

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const current = form.getValues("requirements") || [];
      form.setValue("requirements", [...current, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    const current = form.getValues("requirements") || [];
    form.setValue("requirements", current.filter((_, i) => i !== index));
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      const current = form.getValues("responsibilities") || [];
      form.setValue("responsibilities", [...current, newResponsibility.trim()]);
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    const current = form.getValues("responsibilities") || [];
    form.setValue("responsibilities", current.filter((_, i) => i !== index));
  };

  const startEditRequirement = (index: number, text: string) => {
    setEditingRequirementIndex(index);
    setEditingRequirementText(text);
  };

  const saveEditRequirement = (index: number) => {
    if (editingRequirementText.trim()) {
      const current = form.getValues("requirements") || [];
      const updated = [...current];
      updated[index] = editingRequirementText.trim();
      form.setValue("requirements", updated);
      setEditingRequirementIndex(null);
      setEditingRequirementText("");
    }
  };

  const cancelEditRequirement = () => {
    setEditingRequirementIndex(null);
    setEditingRequirementText("");
  };

  const startEditResponsibility = (index: number, text: string) => {
    setEditingResponsibilityIndex(index);
    setEditingResponsibilityText(text);
  };

  const saveEditResponsibility = (index: number) => {
    if (editingResponsibilityText.trim()) {
      const current = form.getValues("responsibilities") || [];
      const updated = [...current];
      updated[index] = editingResponsibilityText.trim();
      form.setValue("responsibilities", updated);
      setEditingResponsibilityIndex(null);
      setEditingResponsibilityText("");
    }
  };

  const cancelEditResponsibility = () => {
    setEditingResponsibilityIndex(null);
    setEditingResponsibilityText("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Job Description
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Describe the role and what makes it unique
        </p>
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description *</FormLabel>
            <FormControl>
              <RichTextEditor
                content={field.value}
                onChange={field.onChange}
                placeholder="Provide a detailed description of the job, including the role, team, and company culture..."
                className="min-h-[200px]"
                toolbarActions={<AIJobGenerator form={form} />}
              />
            </FormControl>
            <FormDescription>
              Use the toolbar to format your description. This will be displayed on the job board.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="requirements"
        render={() => (
          <FormItem>
            <FormLabel>Requirements *</FormLabel>
            <div className="space-y-3">
              {(form.watch("requirements") || []).map((req, index) => (
                <div key={index} className="flex items-start gap-2">
                  {editingRequirementIndex === index ? (
                    <>
                      <Input
                        value={editingRequirementText}
                        onChange={(e) => setEditingRequirementText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveEditRequirement(index);
                          } else if (e.key === 'Escape') {
                            cancelEditRequirement();
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => saveEditRequirement(index)}
                        title="Save"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={cancelEditRequirement}
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 p-3 bg-secondary/10 rounded-md text-sm">
                        {req}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditRequirement(index, req)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a requirement (e.g., 5+ years of experience)"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRequirement();
                    }
                  }}
                />
                <Button type="button" onClick={addRequirement} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <FormDescription>
              List the key qualifications and skills needed for this role
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="responsibilities"
        render={() => (
          <FormItem>
            <FormLabel>Responsibilities *</FormLabel>
            <div className="space-y-3">
              {(form.watch("responsibilities") || []).map((resp, index) => (
                <div key={index} className="flex items-start gap-2">
                  {editingResponsibilityIndex === index ? (
                    <>
                      <Input
                        value={editingResponsibilityText}
                        onChange={(e) => setEditingResponsibilityText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveEditResponsibility(index);
                          } else if (e.key === 'Escape') {
                            cancelEditResponsibility();
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => saveEditResponsibility(index)}
                        title="Save"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={cancelEditResponsibility}
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 p-3 bg-secondary/10 rounded-md text-sm">
                        {resp}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditResponsibility(index, resp)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeResponsibility(index)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a responsibility (e.g., Design and develop scalable applications)"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addResponsibility();
                    }
                  }}
                />
                <Button type="button" onClick={addResponsibility} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <FormDescription>
              Outline the key duties and day-to-day tasks
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

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

            const handleAddTag = () => {
              const trimmedValue = inputValue.trim();
              if (!trimmedValue) return;
              
              if (currentTags.length >= 5) {
                toast({
                  title: "Maximum tags reached",
                  description: "You can only add up to 5 tags per job",
                  variant: "destructive"
                });
                return;
              }
              
              if (currentTags.includes(trimmedValue)) {
                toast({
                  title: "Duplicate tag",
                  description: "This tag has already been added",
                  variant: "destructive"
                });
                return;
              }
              
              if (trimmedValue.length > 20) {
                toast({
                  title: "Tag too long",
                  description: "Tags must be 20 characters or less",
                  variant: "destructive"
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

            const handleStandardTagClick = (tag: string) => {
              if (currentTags.length >= 5) {
                toast({
                  title: "Maximum tags reached",
                  description: "You can only add up to 5 tags per job",
                  variant: "destructive"
                });
                return;
              }
              if (currentTags.includes(tag)) {
                return;
              }
              field.onChange([...currentTags, tag]);
            };

            return (
              <FormItem>
                <FormDescription>
                  Select from standard tags or create custom ones
                </FormDescription>
                
                <div className="space-y-4 mt-3">
                  {/* Standard Tags */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Quick Add: Standard Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {STANDARD_TAGS.map(tag => {
                        const isAdded = currentTags.includes(tag);
                        const isDisabled = isAdded || currentTags.length >= 5;
                        return (
                          <Badge
                            key={tag}
                            variant={isAdded ? 'secondary' : getTagVariant(tag)}
                            className={cn(
                              "cursor-pointer transition-all text-xs font-medium px-3 py-1.5",
                              isAdded && "opacity-40 cursor-not-allowed line-through",
                              !isAdded && !isDisabled && "hover:opacity-80 hover:scale-105"
                            )}
                            onClick={() => !isDisabled && handleStandardTagClick(tag)}
                          >
                            {isAdded && <Check className="h-3 w-3 mr-1" />}
                            {tag}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Custom Tags */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Add Custom Tag</h4>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder='e.g., "Tech stack specific"'
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
                  </div>
                  
                  {/* Selected Tags */}
                  {currentTags.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Selected Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentTags.map((tag: string) => {
                          const standardTag = STANDARD_TAGS.find(t => t.toLowerCase() === tag.toLowerCase());
                          const variant = standardTag ? getTagVariant(tag) : 'secondary';
                          return (
                            <Badge key={tag} variant={variant} className="px-3 py-1 text-sm flex items-center gap-2">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:bg-background/20 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
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

    </div>
  );
}
