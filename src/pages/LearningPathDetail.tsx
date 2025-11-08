import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, BookOpen, Clock, CheckCircle, Play, Award, Users } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: number;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  instructor: string;
  completedDate?: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalCourses: number;
  completedCourses: number;
  totalDuration: number;
  progress: number;
  enrolledDate: string;
  targetCompletionDate: string;
  courses: Course[];
  skills: string[];
  enrolledUsers: number;
}

const mockLearningPath: LearningPath = {
  id: "LP001",
  title: "Full Stack Developer Path",
  description: "Comprehensive learning path to become a proficient full-stack developer. Master frontend and backend technologies, databases, and deployment strategies.",
  category: "Software Development",
  level: "intermediate",
  totalCourses: 8,
  completedCourses: 3,
  totalDuration: 120,
  progress: 37,
  enrolledDate: "2024-01-15",
  targetCompletionDate: "2024-06-30",
  skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
  enrolledUsers: 24,
  courses: [
    {
      id: "C001",
      title: "React Fundamentals",
      description: "Learn the basics of React including components, props, state, and hooks",
      duration: 15,
      status: "completed",
      progress: 100,
      instructor: "Sarah Johnson",
      completedDate: "2024-02-01",
    },
    {
      id: "C002",
      title: "Advanced React Patterns",
      description: "Master advanced React patterns including context, custom hooks, and performance optimization",
      duration: 20,
      status: "completed",
      progress: 100,
      instructor: "Sarah Johnson",
      completedDate: "2024-02-20",
    },
    {
      id: "C003",
      title: "TypeScript Deep Dive",
      description: "Learn TypeScript from basics to advanced types and generics",
      duration: 12,
      status: "in-progress",
      progress: 60,
      instructor: "Mike Chen",
    },
    {
      id: "C004",
      title: "Node.js Backend Development",
      description: "Build scalable backend applications with Node.js and Express",
      duration: 18,
      status: "not-started",
      progress: 0,
      instructor: "David Wilson",
    },
    {
      id: "C005",
      title: "Database Design with PostgreSQL",
      description: "Master relational database design and SQL queries",
      duration: 15,
      status: "not-started",
      progress: 0,
      instructor: "Emily Brown",
    },
    {
      id: "C006",
      title: "RESTful API Design",
      description: "Learn best practices for designing and building RESTful APIs",
      duration: 10,
      status: "not-started",
      progress: 0,
      instructor: "David Wilson",
    },
    {
      id: "C007",
      title: "Docker & Containerization",
      description: "Learn to containerize applications with Docker and Docker Compose",
      duration: 12,
      status: "not-started",
      progress: 0,
      instructor: "Alex Martinez",
    },
    {
      id: "C008",
      title: "AWS Deployment & DevOps",
      description: "Deploy and manage applications on AWS with CI/CD pipelines",
      duration: 18,
      status: "not-started",
      progress: 0,
      instructor: "Jennifer Lee",
    },
  ],
};

export default function LearningPathDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [learningPath] = useState<LearningPath>(mockLearningPath);

  const getLevelBadge = (level: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      beginner: { variant: 'secondary', label: 'Beginner' },
      intermediate: { variant: 'default', label: 'Intermediate' },
      advanced: { variant: 'destructive', label: 'Advanced' },
    };
    return variants[level] || variants.beginner;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      'not-started': { variant: 'secondary', label: 'Not Started' },
      'in-progress': { variant: 'default', label: 'In Progress' },
      'completed': { variant: 'outline', label: 'Completed' },
    };
    return variants[status] || variants['not-started'];
  };

  const levelBadge = getLevelBadge(learningPath.level);
  const completedHours = learningPath.courses
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.duration, 0);

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>{learningPath.title} - Learning Path</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/talent-development')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{learningPath.title}</h1>
              <p className="text-muted-foreground">{learningPath.category}</p>
            </div>
          </div>
          <Badge variant={levelBadge.variant} className="px-4 py-2">
            {levelBadge.label}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {learningPath.completedCourses}/{learningPath.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((learningPath.completedCourses / learningPath.totalCourses) * 100)}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Time Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedHours}h</div>
              <p className="text-xs text-muted-foreground mt-1">
                of {learningPath.totalDuration}h total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningPath.progress}%</div>
              <Progress value={learningPath.progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Enrolled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningPath.enrolledUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">students enrolled</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About this Learning Path</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{learningPath.description}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="courses" className="space-y-4">
              <TabsList>
                <TabsTrigger value="courses">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Courses
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Award className="h-4 w-4 mr-2" />
                  Skills
                </TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-3">
                {learningPath.courses.map((course, index) => {
                  const statusBadge = getStatusBadge(course.status);
                  return (
                    <Card key={course.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{course.title}</h3>
                                <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{course.description}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {course.duration}h
                              </span>
                              <span>•</span>
                              <span>{course.instructor}</span>
                              {course.completedDate && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    Completed {format(new Date(course.completedDate), 'MMM d, yyyy')}
                                  </span>
                                </>
                              )}
                            </div>
                            {course.status === 'in-progress' && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} />
                              </div>
                            )}
                            <div className="flex gap-2">
                              {course.status === 'not-started' && (
                                <Button size="sm">
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Course
                                </Button>
                              )}
                              {course.status === 'in-progress' && (
                                <Button size="sm">
                                  <Play className="h-4 w-4 mr-2" />
                                  Continue
                                </Button>
                              )}
                              {course.status === 'completed' && (
                                <Button size="sm" variant="outline">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {learningPath.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Completion</span>
                    <span className="font-medium">{learningPath.progress}%</span>
                  </div>
                  <Progress value={learningPath.progress} />
                </div>
                <div className="pt-4 space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Enrolled Date</span>
                    <p className="font-medium">{format(new Date(learningPath.enrolledDate), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target Completion</span>
                    <p className="font-medium">{format(new Date(learningPath.targetCompletionDate), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Complete all courses in this learning path to earn your certificate
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <Award className="h-4 w-4 mr-2" />
                  View Certificate
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Available after completion
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
