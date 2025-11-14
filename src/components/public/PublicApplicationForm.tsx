import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Job } from "@/types/job";
import { saveApplication } from "@/lib/mockApplicationStorage";
import { getCandidateByEmail, saveCandidate } from "@/lib/mockCandidateStorage";
import { Application } from "@/types/application";
import { Candidate } from "@/types/entities";
import { Loader2 } from "lucide-react";

const publicApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  resumeUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
  linkedInUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
  coverLetter: z.string().min(50, "Cover letter should be at least 50 characters"),
  portfolioUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
});

type PublicApplicationFormData = z.infer<typeof publicApplicationSchema>;

interface PublicApplicationFormProps {
  job: Job;
  onSuccess: () => void;
}

export function PublicApplicationForm({ job, onSuccess }: PublicApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PublicApplicationFormData>({
    resolver: zodResolver(publicApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      resumeUrl: "",
      linkedInUrl: "",
      coverLetter: "",
      portfolioUrl: "",
    },
  });

  const onSubmit = async (data: PublicApplicationFormData) => {
    setIsSubmitting(true);
    try {
      // Get or create candidate
      let candidate = getCandidateByEmail(data.email);
      
      if (!candidate) {
        // Create new candidate
        const nameParts = data.fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const newCandidate: Candidate = {
          id: `cand-${Date.now()}`,
          firstName,
          lastName,
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          position: job.title,
          currentPosition: undefined,
          desiredPosition: job.title,
          experience: "0 years",
          experienceYears: 0,
          status: "active",
          source: "job_board",
          experienceLevel: "mid",
          location: job.location,
          city: job.location.split(',')[0],
          state: job.location.split(',')[1]?.trim(),
          country: job.country || "USA",
          salaryCurrency: job.salaryCurrency || "USD",
          workArrangement: job.workArrangement === 'on-site' ? 'onsite' : (job.workArrangement as 'remote' | 'hybrid'),
          employmentTypePreferences: [job.employmentType === 'casual' ? 'part-time' : job.employmentType as 'full-time' | 'part-time' | 'contract'],
          skills: [],
          tags: [],
          linkedInUrl: data.linkedInUrl || undefined,
          portfolioUrl: data.portfolioUrl || undefined,
          appliedDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        saveCandidate(newCandidate);
        candidate = newCandidate;
      }

      // Create application
      const application: Application = {
        id: `app-${Date.now()}`,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        candidatePhoto: candidate.photo,
        jobId: job.id,
        jobTitle: job.title,
        employerName: job.employerId || "Company",
        appliedDate: new Date(),
        status: "applied",
        stage: "New Application",
        isInternalCandidate: false,
        resumeUrl: data.resumeUrl || undefined,
        coverLetterUrl: data.coverLetter, // Store as text for now
        linkedInUrl: data.linkedInUrl || undefined,
        portfolioUrl: data.portfolioUrl || undefined,
        customAnswers: [],
        notes: [],
        activities: [
          {
            id: `activity-${Date.now()}`,
            type: "application_viewed",
            description: "Application submitted via job board",
            createdAt: new Date(),
          },
        ],
        interviews: [],
        isRead: false,
        isNew: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      saveApplication(application);

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully. We'll be in touch soon!",
      });

      onSuccess();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for this Position</CardTitle>
        <CardDescription>
          Fill out the form below to submit your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume/CV URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://drive.google.com/your-resume" {...field} />
                  </FormControl>
                  <FormDescription>
                    Link to your resume (Google Drive, Dropbox, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedInUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-portfolio.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share your motivation and relevant experience (minimum 50 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
