import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { savePerformanceGoal } from "@/lib/performanceStorage";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PerformanceGoal, GoalPriority } from "@/types/performance";

interface GoalCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultantId: string;
  onSuccess?: () => void;
}

interface KPIInput {
  id: string;
  name: string;
  target: string;
  unit: string;
}

export function GoalCreationDialog({ open, onOpenChange, consultantId, onSuccess }: GoalCreationDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("performance");
  const [priority, setPriority] = useState<GoalPriority>("medium");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [targetDate, setTargetDate] = useState<Date | undefined>();
  const [kpis, setKpis] = useState<KPIInput[]>([
    { id: "1", name: "", target: "", unit: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addKPI = () => {
    setKpis([...kpis, { id: Date.now().toString(), name: "", target: "", unit: "" }]);
  };

  const removeKPI = (id: string) => {
    if (kpis.length > 1) {
      setKpis(kpis.filter(k => k.id !== id));
    }
  };

  const updateKPI = (id: string, field: keyof KPIInput, value: string) => {
    setKpis(kpis.map(k => k.id === id ? { ...k, [field]: value } : k));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a goal title");
      return;
    }

    if (!targetDate) {
      toast.error("Please select a target date");
      return;
    }

    const validKPIs = kpis.filter(k => k.name.trim() && k.target.trim() && k.unit.trim());
    if (validKPIs.length === 0) {
      toast.error("Please add at least one KPI");
      return;
    }

    setIsSubmitting(true);

    try {
      const newGoal: PerformanceGoal = {
        id: `goal-${Date.now()}`,
        employeeId: consultantId,
        employeeName: "Consultant", // Would come from consultant data
        title,
        description,
        category,
        priority,
        startDate: startDate.toISOString(),
        targetDate: targetDate.toISOString(),
        progress: 0,
        status: 'not-started',
        kpis: validKPIs.map(k => ({
          id: k.id,
          name: k.name,
          target: parseFloat(k.target),
          current: 0,
          unit: k.unit,
        })),
        createdBy: "current-user", // Would come from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      savePerformanceGoal(newGoal);
      toast.success("Goal created successfully");
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("performance");
      setPriority("medium");
      setStartDate(new Date());
      setTargetDate(undefined);
      setKpis([{ id: "1", name: "", target: "", unit: "" }]);
      
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create goal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Set a new performance goal with measurable KPIs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Increase Monthly Placements to 15"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional context about this goal..."
                rows={3}
              />
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                    <SelectItem value="efficiency">Efficiency</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as GoalPriority)}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Target Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !targetDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {targetDate ? format(targetDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={targetDate} onSelect={setTargetDate} disabled={(date) => date < startDate} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* KPIs */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <Label>Key Performance Indicators *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addKPI}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add KPI
                </Button>
              </div>

              <div className="space-y-3">
                {kpis.map((kpi, index) => (
                  <div key={kpi.id} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="KPI Name (e.g., Placements)"
                        value={kpi.name}
                        onChange={(e) => updateKPI(kpi.id, "name", e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Target (e.g., 15)"
                          value={kpi.target}
                          onChange={(e) => updateKPI(kpi.id, "target", e.target.value)}
                          min="0"
                          step="0.01"
                        />
                        <Input
                          placeholder="Unit (e.g., placements)"
                          value={kpi.unit}
                          onChange={(e) => updateKPI(kpi.id, "unit", e.target.value)}
                        />
                      </div>
                    </div>
                    {kpis.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeKPI(kpi.id)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
