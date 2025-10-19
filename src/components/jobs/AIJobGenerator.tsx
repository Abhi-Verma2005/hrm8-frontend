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
import { Wand2, Sparkles, FileText, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Helper function to extract description from PD text
function extractDescription(text: string): string {
  // Look for common section headers
  const descriptionKeywords = ['overview', 'summary', 'about the role', 'about this role', 'role description', 'position summary'];
  const lines = text.split('\n');
  
  let startIndex = -1;
  let endIndex = lines.length;
  
  // Find section start
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    if (descriptionKeywords.some(keyword => line.includes(keyword))) {
      startIndex = i + 1;
      break;
    }
  }
  
  // If no header found, use first few paragraphs
  if (startIndex === -1) {
    startIndex = 0;
  }
  
  // Find section end (next major section)
  const endKeywords = ['requirements', 'qualifications', 'responsibilities', 'duties', 'what you'];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    if (endKeywords.some(keyword => line.includes(keyword))) {
      endIndex = i;
      break;
    }
  }
  
  // Extract and clean text
  const description = lines.slice(startIndex, Math.min(startIndex + 10, endIndex))
    .filter(line => line.trim().length > 0)
    .join('\n\n');
  
  return description || text.slice(0, 500);
}

// Helper function to extract requirements from PD text
function extractRequirements(text: string): string[] {
  const requirementKeywords = ['requirements', 'qualifications', 'must have', 'required', 'essential'];
  const lines = text.split('\n');
  const requirements: string[] = [];
  
  let inSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Check if we're entering requirements section
    if (requirementKeywords.some(keyword => lowerLine.includes(keyword))) {
      inSection = true;
      continue;
    }
    
    // Check if we're leaving the section
    if (inSection && (lowerLine.includes('responsibilities') || lowerLine.includes('duties') || lowerLine.includes('benefits'))) {
      break;
    }
    
    // Extract bullet points or numbered items
    if (inSection && line.length > 0) {
      const cleaned = line
        .replace(/^[-•*]\s*/, '')
        .replace(/^\d+[\.)]\s*/, '')
        .trim();
      
      if (cleaned.length > 10) {
        requirements.push(cleaned);
      }
    }
  }
  
  // If nothing found, return generic requirements
  if (requirements.length === 0) {
    return [
      'Relevant experience in the field',
      'Strong communication skills',
      'Problem-solving abilities',
      'Team collaboration'
    ];
  }
  
  return requirements.slice(0, 8); // Limit to 8 requirements
}

// Helper function to extract responsibilities from PD text
function extractResponsibilities(text: string): string[] {
  const responsibilityKeywords = ['responsibilities', 'duties', 'what you will do', 'what you\'ll do', 'key duties', 'role responsibilities'];
  const lines = text.split('\n');
  const responsibilities: string[] = [];
  
  let inSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Check if we're entering responsibilities section
    if (responsibilityKeywords.some(keyword => lowerLine.includes(keyword))) {
      inSection = true;
      continue;
    }
    
    // Check if we're leaving the section
    if (inSection && (lowerLine.includes('requirements') || lowerLine.includes('qualifications') || lowerLine.includes('benefits'))) {
      break;
    }
    
    // Extract bullet points or numbered items
    if (inSection && line.length > 0) {
      const cleaned = line
        .replace(/^[-•*]\s*/, '')
        .replace(/^\d+[\.)]\s*/, '')
        .trim();
      
      if (cleaned.length > 10) {
        responsibilities.push(cleaned);
      }
    }
  }
  
  // If nothing found, return generic responsibilities
  if (responsibilities.length === 0) {
    return [
      'Execute key tasks aligned with role objectives',
      'Collaborate with team members',
      'Contribute to project success',
      'Maintain quality standards'
    ];
  }
  
  return responsibilities.slice(0, 8); // Limit to 8 responsibilities
}

interface AIJobGeneratorProps {
  form: UseFormReturn<JobFormData>;
  onScrollToUpload?: () => void;
}

export function AIJobGenerator({ form, onScrollToUpload }: AIJobGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleUploadNow = () => {
    setOpen(false);
    setTimeout(() => {
      onScrollToUpload?.();
    }, 100);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const jobTitle = form.getValues("title") || "Software Engineer";
      const department = form.getValues("department") || "Engineering";
      const experienceLevel = form.getValues("experienceLevel") || "mid";
      const positionDescText = form.getValues("positionDescriptionText");
      
      // If PD file exists, use it to generate content
      if (positionDescText) {
        const description = extractDescription(positionDescText);
        const requirements = extractRequirements(positionDescText);
        const responsibilities = extractResponsibilities(positionDescText);
        
        form.setValue("description", description);
        form.setValue("requirements", requirements.map((text, index) => ({
          id: `req-${Date.now()}-${index}`,
          text,
          order: index + 1,
        })) as any);
        form.setValue("responsibilities", responsibilities.map((text, index) => ({
          id: `resp-${Date.now()}-${index}`,
          text,
          order: index + 1,
        })) as any);
        
        toast({
          title: "Content Generated from Position Description!",
          description: "Job details extracted from your document. Review and edit as needed.",
        });
      } else {
        // Fall back to mock generation
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
        form.setValue("requirements", mockRequirements.map((text, index) => ({
          id: `req-${Date.now()}-${index}`,
          text,
          order: index + 1,
        })) as any);
        form.setValue("responsibilities", mockResponsibilities.map((text, index) => ({
          id: `resp-${Date.now()}-${index}`,
          text,
          order: index + 1,
        })) as any);
        
        toast({
          title: "AI Content Generated!",
          description: "Job description, requirements, and responsibilities have been populated. Feel free to edit them.",
        });
      }
      
      setIsGenerating(false);
      setOpen(false);
    }, 2000);
  };

  const positionDescText = form.watch("positionDescriptionText");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Wand2 className="h-4 w-4 mr-2 text-primary" />
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
            {positionDescText 
              ? "AI will extract job details from your uploaded position description."
              : "Our AI will generate a comprehensive job description based on the basic details you've provided."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {positionDescText && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Position Description Detected</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI will extract job details from your uploaded document.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {!positionDescText && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    💡 Pro Tip: Better Results with a Position Description
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1.5 leading-relaxed">
                    Upload a Position Description document above and the AI will extract 
                    specific details from it, creating a more accurate and detailed job posting.
                  </p>
                  {onScrollToUpload && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 bg-white dark:bg-blue-900 text-blue-700 dark:text-blue-100 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800"
                      onClick={handleUploadNow}
                    >
                      <Upload className="h-3.5 w-3.5 mr-2" />
                      Upload Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          
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
