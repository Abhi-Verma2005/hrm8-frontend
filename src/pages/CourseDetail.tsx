import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, BookOpen, Clock, Users, Play, Award, CheckCircle, Video, FileText } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface Module {
  id: string;
  title: string;
  duration: number;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  completed: boolean;
  locked: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorTitle: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolledStudents: number;
  rating: number;
  totalReviews: number;
  progress: number;
  enrolledDate: string;
  estimatedCompletion: string;
  modules: Module[];
  learningObjectives: string[];
  prerequisites: string[];
}

const mockCourse: Course = {
  id: "C001",
  title: "React Fundamentals",
  description: "Master the fundamentals of React including components, props, state management, hooks, and modern React patterns. This comprehensive course will take you from beginner to confident React developer.",
  instructor: "Sarah Johnson",
  instructorTitle: "Senior Frontend Architect",
  duration: 15,
  level: "beginner",
  enrolledStudents: 142,
  rating: 4.8,
  totalReviews: 89,
  progress: 45,
  enrolledDate: "2024-01-15",
  estimatedCompletion: "2024-02-28",
  learningObjectives: [
    "Understand React core concepts and component lifecycle",
    "Master state management with useState and useReducer hooks",
    "Implement side effects using useEffect",
    "Build reusable custom hooks",
    "Optimize performance with React.memo and useMemo",
    "Handle forms and user input effectively",
  ],
  prerequisites: [
    "Basic JavaScript knowledge",
    "Understanding of ES6+ features",
    "Familiarity with HTML and CSS",
  ],
  modules: [
    {
      id: "M1",
      title: "Introduction to React",
      duration: 45,
      type: "video",
      completed: true,
      locked: false,
    },
    {
      id: "M2",
      title: "Components and JSX",
      duration: 60,
      type: "video",
      completed: true,
      locked: false,
    },
    {
      id: "M3",
      title: "Props and Component Communication",
      duration: 50,
      type: "video",
      completed: true,
      locked: false,
    },
    {
      id: "M4",
      title: "State Management with Hooks",
      duration: 75,
      type: "video",
      completed: false,
      locked: false,
    },
    {
      id: "M5",
      title: "Side Effects and useEffect",
      duration: 65,
      type: "video",
      completed: false,
      locked: false,
    },
    {
      id: "M6",
      title: "Quiz: React Basics",
      duration: 20,
      type: "quiz",
      completed: false,
      locked: false,
    },
    {
      id: "M7",
      title: "Custom Hooks",
      duration: 55,
      type: "video",
      completed: false,
      locked: false,
    },
    {
      id: "M8",
      title: "Performance Optimization",
      duration: 70,
      type: "video",
      completed: false,
      locked: true,
    },
    {
      id: "M9",
      title: "Forms and User Input",
      duration: 50,
      type: "video",
      completed: false,
      locked: true,
    },
    {
      id: "M10",
      title: "Final Project",
      duration: 120,
      type: "assignment",
      completed: false,
      locked: true,
    },
  ],
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course] = useState<Course>(mockCourse);

  const completedModules = course.modules.filter(m => m.completed).length;
  const totalModules = course.modules.length;

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'reading':
        return FileText;
      case 'quiz':
        return CheckCircle;
      case 'assignment':
        return Award;
      default:
        return BookOpen;
    }
  };

  const getLevelBadge = (level: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      beginner: { variant: 'secondary', label: 'Beginner' },
      intermediate: { variant: 'default', label: 'Intermediate' },
      advanced: { variant: 'destructive', label: 'Advanced' },
    };
    return variants[level] || variants.beginner;
  };

  const levelBadge = getLevelBadge(course.level);

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>{course.title} - Course Detail</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/talent-development')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
              <p className="text-muted-foreground">by {course.instructor}</p>
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
                <Clock className="h-4 w-4 text-muted-foreground" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{course.duration}h</div>
              <p className="text-xs text-muted-foreground mt-1">Total time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedModules}/{totalModules}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
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
              <div className="text-2xl font-bold">{course.progress}%</div>
              <Progress value={course.progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{course.enrolledStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Enrolled</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About this Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <Separator className="my-4" />
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-muted-foreground">({course.totalReviews} reviews)</span>
                  </div>
                  <span>•</span>
                  <span className="text-muted-foreground">{course.enrolledStudents} students</span>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="modules" className="space-y-4">
              <TabsList>
                <TabsTrigger value="modules">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Course Content
                </TabsTrigger>
                <TabsTrigger value="objectives">
                  <Award className="h-4 w-4 mr-2" />
                  Learning Objectives
                </TabsTrigger>
              </TabsList>

              <TabsContent value="modules" className="space-y-3">
                {course.modules.map((module, index) => {
                  const ModuleIcon = getModuleIcon(module.type);
                  return (
                    <Card key={module.id} className={module.locked ? 'opacity-60' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            {module.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <ModuleIcon className="h-4 w-4 text-muted-foreground" />
                              <h4 className="font-semibold">{module.title}</h4>
                              {module.locked && (
                                <Badge variant="secondary" className="text-xs">Locked</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{module.duration} min</span>
                              <span>•</span>
                              <span className="capitalize">{module.type}</span>
                            </div>
                          </div>
                          {!module.locked && !module.completed && (
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Start
                            </Button>
                          )}
                          {module.completed && (
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="objectives" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {course.learningObjectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{prereq}</span>
                        </li>
                      ))}
                    </ul>
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
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Completed Modules</span>
                    <span className="font-medium">{completedModules}/{totalModules}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time Spent</span>
                    <span className="font-medium">{Math.floor(course.duration * (course.progress / 100))}h</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">{course.instructor}</p>
                  <p className="text-sm text-muted-foreground">{course.instructorTitle}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Complete this course to earn your certificate of completion
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <Award className="h-4 w-4 mr-2" />
                  View Certificate
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Available after 100% completion
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
