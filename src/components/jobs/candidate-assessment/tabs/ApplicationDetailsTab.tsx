import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Application } from "@/types/application";
import { 
  User,
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Linkedin,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  FileText,
  Shield,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface ApplicationDetailsTabProps {
  application: Application;
}

export function ApplicationDetailsTab({ application }: ApplicationDetailsTabProps) {
  // Mock data for custom questions
  const customQuestions = [
    {
      id: "q1",
      question: "Why do you want to work at our company?",
      answer: "I've been following your company's growth and innovation in the tech space for years. The values of collaboration, continuous learning, and customer-centric approach align perfectly with my professional philosophy. I'm particularly excited about your recent AI initiatives.",
      type: "long-text"
    },
    {
      id: "q2",
      question: "What is your greatest professional achievement?",
      answer: "Leading the migration of a legacy monolithic application to a modern microservices architecture, which resulted in 60% improvement in performance and 40% reduction in operational costs.",
      type: "long-text"
    },
    {
      id: "q3",
      question: "Are you comfortable with our tech stack (React, Node.js, PostgreSQL)?",
      answer: "Yes, very comfortable",
      type: "multiple-choice"
    },
    {
      id: "q4",
      question: "Years of experience with React?",
      answer: "5+ years",
      type: "short-text"
    },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-sm mt-1">{application.candidateName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${application.candidateEmail}`}
                    className="text-sm hover:underline text-primary"
                  >
                    {application.candidateEmail}
                  </a>
                  <Badge variant="outline" className="text-xs">Verified</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">+1 (555) 123-4567</p>
                  <Badge variant="outline" className="text-xs">Verified</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">San Francisco, CA, United States</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">LinkedIn Profile</label>
                <div className="flex items-center gap-2 mt-1">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href="#" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline text-primary flex items-center gap-1"
                  >
                    linkedin.com/in/johndoe
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Portfolio / Website</label>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href="#" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline text-primary flex items-center gap-1"
                  >
                    johndoe.dev
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">GitHub</label>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href="#" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline text-primary flex items-center gap-1"
                  >
                    github.com/johndoe
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Preferred Contact Method</label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm">Email</p>
                  <Badge variant="secondary" className="text-xs">Primary</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Metadata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Application Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{format(application.appliedDate, "PPP 'at' p")}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Application Source</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">LinkedIn</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Application ID</label>
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  {application.id}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{format(application.updatedAt, "PPP 'at' p")}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Referral</label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm">Direct application</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Device Used</label>
                <p className="text-sm text-muted-foreground mt-1">
                  Desktop - Chrome (San Francisco, CA)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Preferences & Expectations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Desired Salary Range</label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">$120,000 - $150,000</p>
                  <Badge variant="secondary" className="text-xs">USD/year</Badge>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">Within job range</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Work Arrangement Preference</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge>Hybrid</Badge>
                  <span className="text-xs text-muted-foreground">2-3 days in office</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Employment Type</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="secondary">Full-time</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Date Availability</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">December 15, 2024</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">2 weeks notice period</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Willing to Relocate</label>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Yes</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Visa Sponsorship Required</label>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">No - US Citizen</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Application Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Questions & Responses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {customQuestions.map((q, index) => (
            <div key={q.id} className={index > 0 ? "pt-6 border-t" : ""}>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-sm font-semibold">
                    Question {index + 1}: {q.question}
                  </h4>
                  <Badge variant="outline" className="text-xs">{q.type}</Badge>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {q.answer}
                  </p>
                </div>

                {q.type === "long-text" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {q.answer.length} characters
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Quality: Good
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* EEO Information */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4" />
            EEO/Demographic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              This information is collected for statistical purposes only and is not used in hiring decisions.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Candidate opted not to provide this information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
