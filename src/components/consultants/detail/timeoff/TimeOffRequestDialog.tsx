import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Consultant } from "@/types/consultant";
import type { TimeOffBalance, TimeOffType } from "@/types/timeoff";
import { createTimeOffRequest, calculateDays, isDateInBlockoutPeriod } from "@/lib/timeoffStorage";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TimeOffRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant: Consultant;
  balances: TimeOffBalance[];
  onSuccess: () => void;
}

const formSchema = z.object({
  type: z.string().min(1, "Time off type is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  isHalfDay: z.boolean().default(false),
  halfDayPeriod: z.enum(["morning", "afternoon"]).optional(),
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
  coverageConsultantId: z.string().optional(),
  coverageNotes: z.string().optional(),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

type FormData = z.infer<typeof formSchema>;

export function TimeOffRequestDialog({
  open,
  onOpenChange,
  consultant,
  balances,
  onSuccess,
}: TimeOffRequestDialogProps) {
  const [blockoutWarning, setBlockoutWarning] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isHalfDay: false,
      reason: "",
    },
  });

  const selectedType = form.watch("type");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const isHalfDay = form.watch("isHalfDay");

  const selectedBalance = balances.find(b => b.type === selectedType);
  const totalDays = startDate && endDate ? calculateDays(
    format(startDate, "yyyy-MM-dd"),
    format(endDate, "yyyy-MM-dd"),
    isHalfDay
  ) : 0;

  // Check for blockout periods
  const checkBlockoutPeriods = (start: Date, end: Date) => {
    const startStr = format(start, "yyyy-MM-dd");
    const endStr = format(end, "yyyy-MM-dd");
    
    const startBlockout = isDateInBlockoutPeriod(startStr, consultant.id);
    const endBlockout = isDateInBlockoutPeriod(endStr, consultant.id);
    
    if (startBlockout || endBlockout) {
      const period = startBlockout || endBlockout;
      setBlockoutWarning(
        `Warning: Your selected dates overlap with "${period?.name}". ${period?.reason}`
      );
    } else {
      setBlockoutWarning(null);
    }
  };

  const onSubmit = (data: FormData) => {
    if (selectedBalance && totalDays > selectedBalance.available) {
      toast.error("Insufficient balance", {
        description: `You only have ${selectedBalance.available} days available`,
      });
      return;
    }

    createTimeOffRequest({
      consultantId: consultant.id,
      consultantName: `${consultant.firstName} ${consultant.lastName}`,
      type: data.type as TimeOffType,
      startDate: format(data.startDate, "yyyy-MM-dd"),
      endDate: format(data.endDate, "yyyy-MM-dd"),
      totalDays,
      isHalfDay: data.isHalfDay,
      halfDayPeriod: data.halfDayPeriod,
      reason: data.reason,
      coverageConsultantId: data.coverageConsultantId,
      coverageNotes: data.coverageNotes,
      status: 'pending',
    });

    toast.success("Time off request submitted successfully");
    form.reset();
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Time Off</DialogTitle>
          <DialogDescription>
            Submit a new time off request for {consultant.firstName} {consultant.lastName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Off Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {balances.map((balance) => (
                        <SelectItem key={balance.type} value={balance.type}>
                          {balance.type.charAt(0).toUpperCase() + balance.type.slice(1)} 
                          ({balance.available} days available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            if (date && endDate) checkBlockoutPeriods(date, endDate);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            if (date && startDate) checkBlockoutPeriods(startDate, date);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isHalfDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Half Day</FormLabel>
                    <FormDescription>
                      Request only half a day off
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

            {isHalfDay && (
              <FormField
                control={form.control}
                name="halfDayPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Half Day Period</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {blockoutWarning && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{blockoutWarning}</AlertDescription>
              </Alert>
            )}

            {totalDays > 0 && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm font-medium">
                  Total Days: <span className="text-lg font-bold">{totalDays}</span>
                </p>
                {selectedBalance && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Remaining after request: {selectedBalance.available - totalDays} days
                  </p>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a reason for your time off request..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverageConsultantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coverage Consultant (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter consultant ID who will provide coverage"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify who will cover your responsibilities
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverageNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coverage Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special instructions or notes for coverage..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
