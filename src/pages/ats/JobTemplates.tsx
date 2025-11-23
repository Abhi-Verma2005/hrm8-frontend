import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Star,
  TrendingUp,
  FileText,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Filter,
  Users,
  Building2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { jobService } from "@/lib/api/jobService";
import { mapBackendJobToFrontend } from "@/lib/jobDataMapper";
import { mapBackendJobToFormData } from "@/lib/jobDataMapper";
import { Job } from "@/types/job";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CreateTemplateDialog } from "@/components/jobs/templates/CreateTemplateDialog";
import { EditTemplateDialog } from "@/components/jobs/templates/EditTemplateDialog";
import { formatDistanceToNow } from "date-fns";
import { templateCategories } from "@/lib/jobTemplateService";
import { useDraftJob } from "@/hooks/useDraftJob";
import { transformJobFormDataToCreateRequest } from "@/lib/jobFormTransformers";

interface TemplateJob extends Job {
  templateName?: string;
  templateDescription?: string;
  templateCategory?: string;
  usageCount?: number;
}

export default function JobTemplates() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "name">("recent");
  const [showMyTemplates, setShowMyTemplates] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateJob | null>(null);
  const [templates, setTemplates] = useState<TemplateJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [useTemplateDialogOpen, setUseTemplateDialogOpen] = useState(false);
  const [templateToUse, setTemplateToUse] = useState<TemplateJob | null>(null);
  const { draftJob: existingDraft, refetch: refetchDraft } = useDraftJob();
  const [latestDraft, setLatestDraft] = useState<Job | null>(null);

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await jobService.getJobs({ status: 'TEMPLATE' });
        if (response.success && response.data) {
          const mappedTemplates = response.data.map(mapBackendJobToFrontend) as TemplateJob[];
          setTemplates(mappedTemplates);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast({
          title: "Error",
          description: "Failed to fetch templates",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [toast]);

  const allTemplates = templates;
  const popularTemplates = [...templates].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 10);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = allTemplates;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.templateDescription?.toLowerCase().includes(query) ||
          t.templateCategory?.toLowerCase().includes(query) ||
          t.department?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.templateCategory === selectedCategory || t.department === selectedCategory);
    }

    // My templates filter
    if (showMyTemplates) {
      filtered = filtered.filter((t) => t.createdBy === user?.id);
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered = [...filtered].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
        break;
      case "name":
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
      default:
        filtered = [...filtered].sort((a, b) => {
          const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return bTime - aTime;
        });
        break;
    }

    return filtered;
  }, [allTemplates, searchQuery, selectedCategory, sortBy, showMyTemplates]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: allTemplates.length,
      myTemplates: allTemplates.filter((t) => t.createdBy === user?.id).length,
      shared: allTemplates.length, // All templates are shared within company
      totalUsage: allTemplates.reduce((sum, t) => sum + (t.usageCount || 0), 0),
    };
  }, [allTemplates, user]);


  const handleUseTemplate = async (template: TemplateJob) => {
    setTemplateToUse(template);
    
    // Refetch to get the latest draft before showing dialog
    const draft = await refetchDraft();
    setLatestDraft(draft);
    
    setUseTemplateDialogOpen(true);
  };

  const confirmUseTemplate = async () => {
    if (!templateToUse) return;

    try {
      // Map template to form data
      const templateFormData = mapBackendJobToFormData(templateToUse);
      
      // Transform to API format using utility function
      const jobRequest = transformJobFormDataToCreateRequest(templateFormData as any, {
        status: 'DRAFT',
      });

      if (latestDraft?.id) {
        // Update existing draft with template data
        await jobService.updateJob(latestDraft.id, {
          ...jobRequest,
          status: 'DRAFT',
        });
      } else {
        // Create new draft with template data
        await jobService.createJob(jobRequest);
      }

      toast({
        title: "Template applied",
        description: `Template data has been filled into your draft job.`,
      });

      setUseTemplateDialogOpen(false);
      setTemplateToUse(null);
      
      // Navigate to jobs page to open the draft, with flag to indicate it's from template
      navigate('/jobs?action=create&fromTemplate=true');
    } catch (error) {
      console.error('Error using template:', error);
      toast({
        title: "Error",
        description: "Failed to apply template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (template: TemplateJob) => {
    setEditingTemplate(template);
  };

  const handleDelete = async (template: TemplateJob) => {
    if (confirm(`Delete template "${template.title}"?`)) {
      try {
        await jobService.deleteJob(template.id);
        setTemplates(templates.filter(t => t.id !== template.id));
        toast({
          title: "Template deleted",
          description: `"${template.title}" has been removed.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete template",
          variant: "destructive",
        });
      }
    }
  };

  const handleDuplicate = (template: TemplateJob) => {
    toast({
      title: "Template duplicated",
      description: `Created a copy of "${template.title}".`,
    });
  };

  return (
    <DashboardPageLayout>
      <div className="p-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Templates</h1>
            <p className="text-muted-foreground">
              Create and manage reusable job posting templates
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.myTemplates} created by you
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shared Templates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.shared}</div>
              <p className="text-xs text-muted-foreground">
                Available to team
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsage}</div>
              <p className="text-xs text-muted-foreground">
                Times used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templateCategories.length}</div>
              <p className="text-xs text-muted-foreground">
                Template categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {templateCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showMyTemplates ? "default" : "outline"}
            onClick={() => setShowMyTemplates(!showMyTemplates)}
          >
            My Templates
          </Button>
        </div>

        {/* Templates Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All Templates ({filteredTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="popular">
              <TrendingUp className="h-4 w-4 mr-2" />
              Popular
            </TabsTrigger>
            {templateCategories.slice(0, 3).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <TemplateGrid
              templates={filteredTemplates}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onUseTemplate={handleUseTemplate}
            />
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <TemplateGrid
              templates={popularTemplates}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onUseTemplate={handleUseTemplate}
            />
          </TabsContent>

          {templateCategories.slice(0, 3).map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <TemplateGrid
                templates={filteredTemplates.filter((t) => t.templateCategory === category || t.department === category)}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onUseTemplate={handleUseTemplate}
              />
            </TabsContent>
          ))}
        </Tabs>

        <CreateTemplateDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />

        {editingTemplate && (
          <EditTemplateDialog
            template={editingTemplate as any}
            open={!!editingTemplate}
            onOpenChange={(open) => !open && setEditingTemplate(null)}
          />
        )}

        <AlertDialog open={useTemplateDialogOpen} onOpenChange={setUseTemplateDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Use Template?</AlertDialogTitle>
              <AlertDialogDescription>
                {latestDraft ? (
                  <>
                    You have an existing draft job: <strong>"{latestDraft.title || 'Untitled Job'}"</strong>.
                    <br /><br />
                    Using this template will <strong>overwrite your current draft</strong> with the template data. 
                    Any changes you made to the draft will be lost. Are you sure you want to continue?
                  </>
                ) : (
                  "This will create a new draft job using the template data. Are you sure you want to continue?"
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setTemplateToUse(null);
                setLatestDraft(null);
              }}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmUseTemplate}>
                {latestDraft ? 'Overwrite Draft & Use Template' : 'Use Template'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardPageLayout>
  );
}

interface TemplateGridProps {
  templates: TemplateJob[];
  onEdit: (template: TemplateJob) => void;
  onDuplicate: (template: TemplateJob) => void;
  onDelete: (template: TemplateJob) => void;
  onUseTemplate: (template: TemplateJob) => void;
}

function TemplateGrid({ templates, onEdit, onDuplicate, onDelete, onUseTemplate }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No templates found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or create a new template
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {template.title}
                  {(template.usageCount || 0) > 20 && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="mt-1 line-clamp-2">
                  {(() => {
                    const description = template.templateDescription || template.description || "No description";
                    const maxLength = 150;
                    if (description.length > maxLength) {
                      return description.substring(0, maxLength).trim() + "...";
                    }
                    return description;
                  })()}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background z-50">
                  <DropdownMenuItem onClick={() => onEdit(template)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(template)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(template)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <Badge variant="secondary">{template.templateCategory || template.department || "Uncategorized"}</Badge>
              <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Created by:</span>
                <span className="font-medium text-foreground">
                  {template.createdByName || "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Usage count:</span>
                <span className="font-medium text-foreground">
                  {template.usageCount || 0} times
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Created:</span>
                <span className="font-medium text-foreground">
                  {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {template.title && (
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Template includes:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {template.title && (
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>Job Title: {template.title}</span>
                    </li>
                  )}
                  {template.department && (
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>Department: {template.department}</span>
                    </li>
                  )}
                  {template.employmentType && (
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>Type: {template.employmentType}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => onUseTemplate(template)}
            >
              Use Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
