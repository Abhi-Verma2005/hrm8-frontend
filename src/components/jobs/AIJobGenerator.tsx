import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { JobFormData } from "@/types/job";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Wand2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AIJobGeneratorProps {
  form: UseFormReturn<JobFormData>;
}

export function AIJobGenerator({ form }: AIJobGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Mock AI generation - in real implementation, this would call an AI service
    setTimeout(() => {
      const jobTitle = form.getValues("title") || "Software Engineer";
      const department = form.getValues("department") || "Engineering";
      const experienceLevel = form.getValues("experienceLevel") || "mid";
      
      // Mock generated content
      const mockDescription = `We are seeking a talented ${jobTitle} to join our ${department} team. This is an exciting opportunity to work on cutting-edge projects and make a real impact. You'll collaborate with cross-functional teams to deliver high-quality solutions that drive our business forward.

Our ideal candidate is passionate about technology, has a strong problem-solving mindset, and thrives in a fast-paced environment. We offer competitive compensation, comprehensive benefits, and opportunities for professional growth.`;

      const mockRequirements = [
        `${experienceLevel === 'entry' ? '1-2' : experienceLevel === 'mid' ? '3-5' : '5+'} years of relevant experience`,
        'Strong technical skills and problem-solving abilities',
        'Excellent communication and collaboration skills',
        'Bachelor\'s degree in relevant field or equivalent experience',
        'Proven track record of delivering high-quality work'
      ];

      const mockResponsibilities = [
        'Design and implement solutions that meet business requirements',
        'Collaborate with team members and stakeholders',
        'Participate in code reviews and technical discussions',
        'Contribute to continuous improvement initiatives',
        'Mentor junior team members and share knowledge'
      ];

      form.setValue("description", mockDescription);
      form.setValue("requirements", mockRequirements);
      form.setValue("responsibilities", mockResponsibilities);
      
      setIsGenerating(false);
      setOpen(false);
      
      toast({
        title: "AI Content Generated!",
        description: "Job description, requirements, and responsibilities have been populated. Feel free to edit them.",
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Wand2 className="h-4 w-4 mr-2" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Job Description Generator
          </DialogTitle>
          <DialogDescription>
            Our AI will generate a comprehensive job description based on the basic details you've provided. You can edit the generated content before saving.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="p-4 bg-secondary/10 rounded-lg">
            <h4 className="font-medium mb-2">What we'll generate:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Compelling job description</li>
              <li>• Key requirements and qualifications</li>
              <li>• Core responsibilities and duties</li>
            </ul>
          </div>
          
          {!form.getValues("title") && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-md text-sm">
              <p className="text-warning">Please fill in at least the job title in Step 1 for better AI generation.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating || !form.getValues("title")}>
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
