import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  Clock,
  Search,
  Filter,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Target,
  BarChart3,
  Users,
  FileText,
  Star,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import {
  Course,
  TrainingPath,
  CourseEnrollment,
  EmployeeCertification,
  SkillDevelopmentProgram,
  LearningAnalytics,
} from '@/types/performance';

interface LearningDevelopmentProps {
  courses: Course[];
  trainingPaths: TrainingPath[];
  enrollments: CourseEnrollment[];
  certifications: EmployeeCertification[];
  skillPrograms: SkillDevelopmentProgram[];
  analytics: LearningAnalytics;
  onEnrollCourse: (courseId: string) => void;
  onStartCourse: (enrollmentId: string) => void;
  onViewCertificate: (certificationId: string) => void;
}

export function LearningDevelopment({
  courses,
  trainingPaths,
  enrollments,
  certifications,
  skillPrograms,
  analytics,
  onEnrollCourse,
  onStartCourse,
  onViewCertificate,
}: LearningDevelopmentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'not-started':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      'active': 'default',
      'completed': 'secondary',
      'expired': 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-700',
      'intermediate': 'bg-blue-100 text-blue-700',
      'advanced': 'bg-purple-100 text-purple-700',
      'expert': 'bg-red-100 text-red-700',
    };
    return (
      <Badge className={colors[level] || 'bg-muted'}>
        {level}
      </Badge>
    );
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = Array.from(new Set(courses.map(c => c.category)));

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLearningHours}h</div>
            <p className="text-xs text-muted-foreground">
              {analytics.learningStreak} day streak 🔥
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.coursesCompleted}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.coursesInProgress} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.certificationsEarned}</div>
            <p className="text-xs text-muted-foreground">
              Earned certifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageAssessmentScore}%</div>
            <p className="text-xs text-muted-foreground">
              Assessment performance
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-learning" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-learning">
            <BookOpen className="h-4 w-4 mr-2" />
            My Learning
          </TabsTrigger>
          <TabsTrigger value="catalog">
            <Search className="h-4 w-4 mr-2" />
            Course Catalog
          </TabsTrigger>
          <TabsTrigger value="paths">
            <Target className="h-4 w-4 mr-2" />
            Training Paths
          </TabsTrigger>
          <TabsTrigger value="certifications">
            <Award className="h-4 w-4 mr-2" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="programs">
            <TrendingUp className="h-4 w-4 mr-2" />
            Development Programs
          </TabsTrigger>
        </TabsList>

        {/* My Learning Tab */}
        <TabsContent value="my-learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Track your learning progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollments.map(enrollment => (
                <div key={enrollment.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(enrollment.status)}
                      <h4 className="font-semibold">{enrollment.courseTitle}</h4>
                      {enrollment.isRequired && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.floor(enrollment.timeSpent / 60)}h {enrollment.timeSpent % 60}m spent
                      </div>
                      {enrollment.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due {new Date(enrollment.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {enrollment.assessmentScores.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>
                          Latest score: {enrollment.assessmentScores[enrollment.assessmentScores.length - 1].score}%
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => onStartCourse(enrollment.id)}
                    disabled={enrollment.status === 'completed'}
                  >
                    {enrollment.status === 'completed' ? 'Completed' : 'Continue'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}

              {enrollments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No enrolled courses yet</p>
                  <p className="text-sm">Browse the course catalog to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Catalog Tab */}
        <TabsContent value="catalog" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden">
                    {course.thumbnail && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{course.title}</CardTitle>
                        {getLevelBadge(course.level)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}h
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.enrollmentCount}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {course.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-lg font-bold">${course.price}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onEnrollCourse(course.id)}
                        >
                          Enroll
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No courses found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Paths Tab */}
        <TabsContent value="paths" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Paths</CardTitle>
              <CardDescription>Structured learning journeys for career growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingPaths.map(path => (
                  <Card key={path.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{path.title}</CardTitle>
                            {path.isRecommended && (
                              <Badge variant="default">Recommended</Badge>
                            )}
                          </div>
                          <CardDescription>{path.description}</CardDescription>
                        </div>
                        {getLevelBadge(path.level)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Target Role:</span>
                            <span className="text-muted-foreground">{path.targetRole || 'Various'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Duration:</span>
                            <span className="text-muted-foreground">{path.estimatedDuration}h total</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Courses:</span>
                            <span className="text-muted-foreground">{path.courses.length} courses</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Enrolled:</span>
                            <span className="text-muted-foreground">{path.enrollmentCount} people</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Skills Covered:</p>
                          <div className="flex flex-wrap gap-1">
                            {path.skills.map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button className="w-full">
                        Start Learning Path
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Certifications</CardTitle>
              <CardDescription>Track your professional certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map(cert => (
                  <div key={cert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{cert.certificationTitle}</h4>
                          <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                        </div>
                        {getStatusBadge(cert.status)}
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Issued: {new Date(cert.issuedDate).toLocaleDateString()}</span>
                        </div>
                        {cert.expiryDate && (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-muted-foreground" />
                            <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span>Certificate #: {cert.certificateNumber}</span>
                        </div>
                        {cert.creditsEarned && (
                          <div className="flex items-center gap-2">
                            <Trophy className="h-3 w-3 text-muted-foreground" />
                            <span>{cert.creditsEarned} credits earned</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewCertificate(cert.id)}
                    >
                      View Certificate
                    </Button>
                  </div>
                ))}

                {certifications.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No certifications yet</p>
                    <p className="text-sm">Complete courses to earn certifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Development Programs Tab */}
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Development Programs</CardTitle>
              <CardDescription>Structured programs for career advancement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillPrograms.map(program => (
                  <Card key={program.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{program.title}</CardTitle>
                          <CardDescription>{program.description}</CardDescription>
                        </div>
                        <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                          {program.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Manager:</span>
                            <span className="text-muted-foreground">{program.managerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Timeline:</span>
                            <span className="text-muted-foreground">
                              {new Date(program.startDate).toLocaleDateString()} - {new Date(program.targetEndDate).toLocaleDateString()}
                            </span>
                          </div>
                          {program.budget && (
                            <div className="flex items-center gap-2 text-sm">
                              <BarChart3 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Budget:</span>
                              <span className="text-muted-foreground">
                                ${program.spentAmount || 0} / ${program.budget}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Target Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {program.targetSkills.map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Overall Progress</span>
                          <span className="font-medium">{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Milestones ({program.milestones.length})</p>
                        <div className="space-y-2">
                          {program.milestones.slice(0, 3).map(milestone => (
                            <div key={milestone.id} className="flex items-center gap-2 text-sm">
                              {milestone.status === 'completed' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={milestone.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                                {milestone.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" variant="outline">
                        View Full Program
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {skillPrograms.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No development programs yet</p>
                    <p className="text-sm">Talk to your manager about creating a development plan</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
