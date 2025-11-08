import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, Award, TrendingUp, Users, Calendar } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function TrainingDevelopment() {
  const trainingStats = {
    activeCourses: 45,
    completedThisMonth: 127,
    avgCompletionRate: 78,
    totalHours: 2450
  };

  const courseCategories = [
    { name: 'Technical Skills', count: 18, color: 'hsl(var(--chart-1))' },
    { name: 'Leadership', count: 12, color: 'hsl(var(--chart-2))' },
    { name: 'Compliance', count: 8, color: 'hsl(var(--chart-3))' },
    { name: 'Soft Skills', count: 7, color: 'hsl(var(--chart-4))' }
  ];

  const completionTrend = [
    { month: 'Jan', completed: 95, enrolled: 120 },
    { month: 'Feb', completed: 110, enrolled: 145 },
    { month: 'Mar', completed: 127, enrolled: 160 },
    { month: 'Apr', completed: 135, enrolled: 175 },
    { month: 'May', completed: 142, enrolled: 180 },
    { month: 'Jun', completed: 155, enrolled: 195 }
  ];

  const topCourses = [
    { 
      id: 1, 
      title: 'Advanced React Development', 
      category: 'Technical', 
      enrolled: 42, 
      completed: 28, 
      avgRating: 4.8,
      progress: 67 
    },
    { 
      id: 2, 
      title: 'Leadership Fundamentals', 
      category: 'Leadership', 
      enrolled: 35, 
      completed: 30, 
      avgRating: 4.6,
      progress: 86 
    },
    { 
      id: 3, 
      title: 'Data Privacy & Security', 
      category: 'Compliance', 
      enrolled: 58, 
      completed: 55, 
      avgRating: 4.2,
      progress: 95 
    },
    { 
      id: 4, 
      title: 'Effective Communication', 
      category: 'Soft Skills', 
      enrolled: 31, 
      completed: 22, 
      avgRating: 4.7,
      progress: 71 
    }
  ];

  const learningPaths = [
    {
      id: 1,
      name: 'Frontend Developer Track',
      courses: 8,
      duration: '6 months',
      enrolled: 24,
      completed: 12
    },
    {
      id: 2,
      name: 'Engineering Manager Track',
      courses: 6,
      duration: '4 months',
      enrolled: 15,
      completed: 8
    },
    {
      id: 3,
      name: 'DevOps Specialist',
      courses: 10,
      duration: '8 months',
      enrolled: 18,
      completed: 7
    }
  ];

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Training & Development</h1>
            <p className="text-muted-foreground">Manage employee learning and development programs</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Training
            </Button>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              New Course
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                  <p className="text-3xl font-bold mt-2">{trainingStats.activeCourses}</p>
                  <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold mt-2">{trainingStats.completedThisMonth}</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold mt-2">{trainingStats.avgCompletionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">+5% vs last month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Training Hours</p>
                  <p className="text-3xl font-bold mt-2">{trainingStats.totalHours}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total this quarter</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Popular Courses</CardTitle>
                  <CardDescription>Most enrolled training programs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topCourses.map(course => (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{course.title}</h4>
                              <Badge variant="secondary" className="mt-1">{course.category}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-amber-500" />
                              <span className="font-semibold">{course.avgRating}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} />
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{course.completed}/{course.enrolled} completed</span>
                            <Button size="sm" variant="outline">View Details</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Categories</CardTitle>
                  <CardDescription>Distribution by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={courseCategories}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label
                      >
                        {courseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {courseCategories.map(category => (
                      <div key={category.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: category.color }} />
                          <span>{category.name}</span>
                        </div>
                        <span className="font-semibold">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="paths" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Learning Paths</CardTitle>
                <CardDescription>Structured development programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {learningPaths.map(path => (
                    <Card key={path.id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">{path.name}</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>{path.courses} courses</p>
                              <p>Duration: {path.duration}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Completion</span>
                              <span className="font-semibold">{Math.round((path.completed / path.enrolled) * 100)}%</span>
                            </div>
                            <Progress value={(path.completed / path.enrolled) * 100} />
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{path.enrolled} enrolled</span>
                          </div>
                          <Button className="w-full" variant="outline">View Path</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment & Completion Trends</CardTitle>
                <CardDescription>Monthly training activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={completionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="enrolled" stroke="hsl(var(--chart-1))" name="Enrolled" strokeWidth={2} />
                    <Line type="monotone" dataKey="completed" stroke="hsl(var(--chart-2))" name="Completed" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Professional Certifications</CardTitle>
                <CardDescription>Track employee certifications and renewals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'AWS Certified Solutions Architect', holders: 12, expiring: 3 },
                    { name: 'PMP Certification', holders: 8, expiring: 1 },
                    { name: 'Certified Scrum Master', holders: 15, expiring: 5 },
                    { name: 'CISSP', holders: 6, expiring: 0 }
                  ].map((cert, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{cert.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {cert.holders} certified employees
                            </p>
                          </div>
                          <div className="text-right">
                            {cert.expiring > 0 && (
                              <Badge variant="destructive">{cert.expiring} expiring soon</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
