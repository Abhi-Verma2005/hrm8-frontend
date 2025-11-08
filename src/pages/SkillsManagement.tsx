import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, TrendingUp, AlertCircle, Plus, Users } from "lucide-react";
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SkillsManagement() {
  const skillCategories = [
    {
      id: 1,
      name: 'Technical Skills',
      skills: [
        { name: 'React', employees: 45, avgProficiency: 78, demand: 85 },
        { name: 'TypeScript', employees: 52, avgProficiency: 72, demand: 90 },
        { name: 'Node.js', employees: 38, avgProficiency: 68, demand: 75 },
        { name: 'Python', employees: 32, avgProficiency: 65, demand: 80 }
      ]
    },
    {
      id: 2,
      name: 'Soft Skills',
      skills: [
        { name: 'Leadership', employees: 28, avgProficiency: 75, demand: 70 },
        { name: 'Communication', employees: 95, avgProficiency: 82, demand: 95 },
        { name: 'Problem Solving', employees: 78, avgProficiency: 80, demand: 85 }
      ]
    },
    {
      id: 3,
      name: 'Domain Knowledge',
      skills: [
        { name: 'Healthcare IT', employees: 15, avgProficiency: 85, demand: 60 },
        { name: 'Financial Services', employees: 22, avgProficiency: 78, demand: 75 }
      ]
    }
  ];

  const skillGapData = [
    { skill: 'React', current: 78, required: 85, gap: 7 },
    { skill: 'TypeScript', current: 72, required: 90, gap: 18 },
    { skill: 'Node.js', current: 68, required: 75, gap: 7 },
    { skill: 'Python', current: 65, required: 80, gap: 15 },
    { skill: 'Leadership', current: 75, required: 70, gap: -5 }
  ];

  const teamCompetency = [
    { subject: 'Frontend', current: 75, target: 85 },
    { subject: 'Backend', current: 68, target: 80 },
    { subject: 'DevOps', current: 55, target: 75 },
    { subject: 'Design', current: 62, target: 70 },
    { subject: 'Testing', current: 70, target: 80 },
    { subject: 'Security', current: 58, target: 75 }
  ];

  const assessmentQueue = [
    { id: 1, employee: 'John Smith', skill: 'React', dueDate: '2024-01-20', status: 'pending' },
    { id: 2, employee: 'Sarah Johnson', skill: 'TypeScript', dueDate: '2024-01-22', status: 'in-progress' },
    { id: 3, employee: 'Mike Wilson', skill: 'Leadership', dueDate: '2024-01-25', status: 'pending' }
  ];

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Skills Management</h1>
            <p className="text-muted-foreground">Track and develop employee skills and competencies</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Set Targets
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
                  <p className="text-3xl font-bold mt-2">87</p>
                  <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Proficiency</p>
                  <p className="text-3xl font-bold mt-2">74%</p>
                  <p className="text-xs text-muted-foreground mt-1">+3% from last quarter</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skill Gaps</p>
                  <p className="text-3xl font-bold mt-2">12</p>
                  <p className="text-xs text-muted-foreground mt-1">Critical gaps identified</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assessments Due</p>
                  <p className="text-3xl font-bold mt-2">23</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="skills" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="skills">Skills Inventory</TabsTrigger>
            <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
            <TabsTrigger value="competency">Competency</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            {skillCategories.map(category => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.skills.length} skills in this category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.skills.map(skill => (
                      <Card key={skill.name}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{skill.name}</h4>
                                <Badge variant="secondary">
                                  <Users className="h-3 w-3 mr-1" />
                                  {skill.employees} employees
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">Avg Proficiency</span>
                                    <span className="font-semibold">{skill.avgProficiency}%</span>
                                  </div>
                                  <Progress value={skill.avgProficiency} />
                                </div>
                                <div>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">Market Demand</span>
                                    <span className="font-semibold">{skill.demand}%</span>
                                  </div>
                                  <Progress value={skill.demand} />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View Details</Button>
                            <Button size="sm" variant="outline">Assess Employees</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="gaps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
                <CardDescription>Comparison between current and required proficiency levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={skillGapData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="hsl(var(--chart-1))" name="Current Level" />
                    <Bar dataKey="required" fill="hsl(var(--chart-2))" name="Required Level" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold">Critical Gaps</h4>
                  {skillGapData
                    .filter(item => item.gap > 10)
                    .map(item => (
                      <Card key={item.skill}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-semibold">{item.skill}</h5>
                              <p className="text-sm text-muted-foreground">
                                Gap: {item.gap} points ({item.current}% → {item.required}%)
                              </p>
                            </div>
                            <Button size="sm">Create Training Plan</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Competency Radar</CardTitle>
                <CardDescription>Current vs target competency levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={teamCompetency}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Current" dataKey="current" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.5} />
                    <Radar name="Target" dataKey="target" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.5} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assessments</CardTitle>
                <CardDescription>Scheduled skill assessments and evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessmentQueue.map(assessment => (
                    <Card key={assessment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{assessment.employee}</h4>
                            <p className="text-sm text-muted-foreground">
                              Skill: {assessment.skill} • Due: {assessment.dueDate}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={assessment.status === 'in-progress' ? 'default' : 'secondary'}>
                              {assessment.status}
                            </Badge>
                            <Button size="sm">Start Assessment</Button>
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
