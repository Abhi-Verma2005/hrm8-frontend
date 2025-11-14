import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Application } from "@/types/application";
import { 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  AlertTriangle,
  Star,
  Award
} from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { AIMatchScoreCard } from "../AIMatchScoreCard";

interface OverviewTabProps {
  application: Application;
}

export function OverviewTab({ application }: OverviewTabProps) {
  const daysInCurrentStage = differenceInDays(new Date(), application.appliedDate);
  const totalDaysInPipeline = differenceInDays(new Date(), application.appliedDate);

  // Mock data - would come from application in production
  const keySkills = [
    { name: "React", proficiency: 90 },
    { name: "TypeScript", proficiency: 85 },
    { name: "Node.js", proficiency: 80 },
    { name: "PostgreSQL", proficiency: 75 },
    { name: "AWS", proficiency: 70 },
  ];

  const achievements = [
    "Led team of 5 developers on enterprise project",
    "Increased application performance by 40%",
    "Published 3 technical articles",
    "Speaker at 2 tech conferences",
  ];

  const redFlags = [
    { type: "warning", message: "Salary expectations 15% above budget" },
    { type: "info", message: "3-month notice period required" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* At-a-Glance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>At-a-Glance Summary</CardTitle>
            <CardDescription>Quick overview of application status and timeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>In Current Stage</span>
                </div>
                <p className="text-2xl font-bold">{daysInCurrentStage}d</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Total Days</span>
                </div>
                <p className="text-2xl font-bold">{totalDaysInPipeline}d</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Interviews</span>
                </div>
                <p className="text-2xl font-bold">{application.interviews?.length || 0}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Team Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">{application.rating || 0}</p>
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Application Strength Meter */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Application Strength</span>
                <span className="text-muted-foreground">{application.aiMatchScore || 0}%</span>
              </div>
              <div className="relative w-full h-3 overflow-hidden rounded-full bg-muted">
                <div 
                  className={`h-full transition-all ${
                    (application.aiMatchScore || 0) >= 80 
                      ? 'bg-green-500' 
                      : (application.aiMatchScore || 0) >= 60 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${application.aiMatchScore || 0}%` }}
                />
              </div>
            </div>

            {/* Last Activity */}
            <div className="pt-4 border-t text-sm text-muted-foreground">
              <span className="font-medium">Last Activity:</span>{" "}
              {formatDistanceToNow(application.updatedAt, { addSuffix: true })}
            </div>
          </CardContent>
        </Card>

        {/* Key Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle>Key Qualifications</CardTitle>
            <CardDescription>Core skills and experience matching job requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skills with Proficiency */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Top Matching Skills</h4>
              <div className="space-y-3">
                {keySkills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.proficiency}%</span>
                    </div>
                    <div className="relative w-full h-2 overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience & Education */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>Experience</span>
                </div>
                <p className="text-lg font-semibold">8+ years</p>
                <p className="text-xs text-muted-foreground">Full-stack development</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>Education</span>
                </div>
                <p className="text-lg font-semibold">Master's Degree</p>
                <p className="text-xs text-muted-foreground">Computer Science</p>
              </div>
            </div>

            {/* Notable Achievements */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Notable Achievements</h4>
              <ul className="space-y-2">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Application Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>Application Highlights</CardTitle>
            <CardDescription>Key information from the candidate's application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cover Letter Summary */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Cover Letter Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Experienced full-stack developer with 8+ years building scalable web applications. 
                Passionate about clean code and team collaboration. Excited about the opportunity 
                to contribute to innovative projects and mentor junior developers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              {/* Salary */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Salary Expectations</span>
                </div>
                <p className="text-sm font-medium">$120K - $150K</p>
                <Badge variant="outline" className="text-xs">
                  Within range
                </Badge>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Availability</span>
                </div>
                <p className="text-sm font-medium">2 weeks notice</p>
                <p className="text-xs text-muted-foreground">Available from Dec 15, 2024</p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Relocation</span>
                </div>
                <p className="text-sm font-medium">Willing to relocate</p>
                <Badge variant="secondary" className="text-xs">
                  Flexible
                </Badge>
              </div>

              {/* Work Authorization */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Work Authorization</span>
                </div>
                <p className="text-sm font-medium">US Citizen</p>
                <Badge variant="secondary" className="text-xs">
                  No sponsorship needed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Red Flags & Concerns */}
        {redFlags.length > 0 && (
          <Card className="border-yellow-200 dark:border-yellow-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle>Items Requiring Attention</CardTitle>
              </div>
              <CardDescription>Points to discuss or clarify with the candidate</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{flag.message}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Sidebar - AI Match Score */}
      <div>
        <AIMatchScoreCard application={application} />
      </div>
    </div>
  );
}
