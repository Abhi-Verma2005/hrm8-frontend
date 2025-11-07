import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";

const feedbackSchema = z.object({
  technicalSkills: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  cultureFit: z.number().min(1).max(5),
  problemSolving: z.number().min(1).max(5),
  overallRating: z.number().min(1).max(5),
  strengths: z.string().min(10, "Please provide detailed strengths"),
  concerns: z.string().min(10, "Please provide detailed concerns"),
  recommendation: z.enum(["strong-yes", "yes", "maybe", "no", "strong-no"]),
  notes: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface InterviewFeedbackFormProps {
  candidateName: string;
  jobTitle: string;
  onSubmit: (data: FeedbackFormData) => void;
  onCancel: () => void;
}

export function InterviewFeedbackForm({ candidateName, jobTitle, onSubmit, onCancel }: InterviewFeedbackFormProps) {
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      technicalSkills: 3,
      communication: 3,
      cultureFit: 3,
      problemSolving: 3,
      overallRating: 3,
      recommendation: "maybe",
    },
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold">{candidateName}</h3>
        <p className="text-sm text-muted-foreground">{jobTitle}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating Criteria */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rating Criteria</h3>
            
            <FormField
              control={form.control}
              name="technicalSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Technical Skills</span>
                    {renderStars(field.value)}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="communication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Communication</span>
                    {renderStars(field.value)}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cultureFit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Culture Fit</span>
                    {renderStars(field.value)}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problemSolving"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Problem Solving</span>
                    {renderStars(field.value)}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overallRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Overall Rating</span>
                    {renderStars(field.value)}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Written Feedback */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Written Feedback</h3>

            <FormField
              control={form.control}
              name="strengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strengths</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did the candidate do well? What impressed you?"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="concerns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concerns</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What areas need improvement? Any red flags?"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any other observations or comments..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Recommendation */}
          <FormField
            control={form.control}
            name="recommendation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hiring Recommendation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="strong-yes">Strong Yes - Definitely hire</SelectItem>
                    <SelectItem value="yes">Yes - Would be a good hire</SelectItem>
                    <SelectItem value="maybe">Maybe - On the fence</SelectItem>
                    <SelectItem value="no">No - Not a good fit</SelectItem>
                    <SelectItem value="strong-no">Strong No - Definitely do not hire</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Your overall recommendation for this candidate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Submit Feedback</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
