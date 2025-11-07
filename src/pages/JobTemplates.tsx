import { useState, useMemo } from "react";
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
  getJobTemplates, 
  getMostUsedTemplates, 
  deleteJobTemplate,
  templateCategories,
  JobTemplate 
} from "@/lib/jobTemplateService";
import { useToast } from "@/hooks/use-toast";
import { CreateTemplateDialog } from "@/components/jobs/templates/CreateTemplateDialog";
import { EditTemplateDialog } from "@/components/jobs/templates/EditTemplateDialog";
import { formatDistanceToNow } from "date-fns";

export default function JobTemplates() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "name">("recent");
  const [showMyTemplates, setShowMyTemplates] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<JobTemplate | null>(null);

  const allTemplates = getJobTemplates();
  const popularTemplates = getMostUsedTemplates(10);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = allTemplates;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // My templates filter
    if (showMyTemplates) {
      filtered = filtered.filter((t) => t.createdBy === "Current User");
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered = [...filtered].sort((a, b) => b.usageCount - a.usageCount);
        break;
      case "name":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recent":
      default:
        filtered = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return filtered;
  }, [allTemplates, searchQuery, selectedCategory, sortBy, showMyTemplates]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: allTemplates.length,
      myTemplates: allTemplates.filter((t) => t.createdBy === "Current User").length,
      shared: allTemplates.filter((t) => t.isShared).length,
      totalUsage: allTemplates.reduce((sum, t) => sum + t.usageCount, 0),
    };
  }, [allTemplates]);

  const handleDelete = (template: JobTemplate) => {
    if (confirm(`Delete template "${template.name}"?`)) {
      deleteJobTemplate(template.id);
      toast({
        title: "Template deleted",
        description: `"${template.name}" has been removed.`,
      });
    }
  };

  const handleDuplicate = (template: JobTemplate) => {
    toast({
      title: "Template duplicated",
      description: `Created a copy of "${template.name}".`,
    });
  };

  const handleEdit = (template: JobTemplate) => {
    setEditingTemplate(template);
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
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
            />
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <TemplateGrid
              templates={popularTemplates}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          </TabsContent>

          {templateCategories.slice(0, 3).map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <TemplateGrid
                templates={filteredTemplates.filter((t) => t.category === category)}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
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
            template={editingTemplate}
            open={!!editingTemplate}
            onOpenChange={(open) => !open && setEditingTemplate(null)}
          />
        )}
      </div>
    </DashboardPageLayout>
  );
}

interface TemplateGridProps {
  templates: JobTemplate[];
  onEdit: (template: JobTemplate) => void;
  onDuplicate: (template: JobTemplate) => void;
  onDelete: (template: JobTemplate) => void;
}

function TemplateGrid({ templates, onEdit, onDuplicate, onDelete }: TemplateGridProps) {
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
        <Card key={template.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {template.name}
                  {template.usageCount > 20 && (
                    <Badge variant="orange" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  {template.description || "No description"}
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
              <Badge variant="secondary">{template.category}</Badge>
              {template.isShared && (
                <Badge variant="teal" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Created by:</span>
                <span className="font-medium text-foreground">
                  {template.createdBy}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Usage count:</span>
                <span className="font-medium text-foreground">
                  {template.usageCount} times
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Created:</span>
                <span className="font-medium text-foreground">
                  {formatDistanceToNow(template.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>

            {template.data.title && (
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Template includes:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {template.data.title && (
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>Job Title: {template.data.title}</span>
                    </li>
                  )}
                  {template.data.department && (
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>Department: {template.data.department}</span>
                    </li>
                  )}
                  {template.data.employmentType && (
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>Type: {template.data.employmentType}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => onEdit(template)}
            >
              Use Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
