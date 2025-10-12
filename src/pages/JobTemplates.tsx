import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Eye, Pencil, Trash2, Copy } from "lucide-react";
import { getJobTemplates, deleteJobTemplate } from "@/lib/mockJobStorage";
import { JobTemplate } from "@/types/job";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
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

export default function JobTemplates() {
  const [previewTemplate, setPreviewTemplate] = useState<JobTemplate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const templates = useMemo(() => getJobTemplates(), [refreshKey]);
  const systemTemplates = templates.filter(t => t.isSystemTemplate);
  const customTemplates = templates.filter(t => !t.isSystemTemplate);

  const handleDelete = (id: string) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      deleteJobTemplate(templateToDelete);
      toast({
        title: "Template Deleted",
        description: "The job template has been removed.",
      });
      setRefreshKey(prev => prev + 1);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const TemplateCard = ({ template }: { template: JobTemplate }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{template.title}</CardTitle>
            <CardDescription className="truncate">{template.templateName}</CardDescription>
          </div>
          {template.isSystemTemplate && (
            <Badge variant="secondary" className="ml-2">System</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Badge variant="outline">{template.employmentType}</Badge>
          <span>•</span>
          <span>{template.department}</span>
          <span>•</span>
          <span>{template.experienceLevel}</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPreviewTemplate(template)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {!template.isSystemTemplate && (
            <>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDelete(template.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          {template.isSystemTemplate && (
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/jobs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Job Templates</h1>
              <p className="text-muted-foreground">Reusable templates for faster job creation</p>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* System Templates */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">System Templates</h2>
            <p className="text-sm text-muted-foreground">
              Pre-built templates for common job roles
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>

        <Separator />

        {/* Custom Templates */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">My Templates</h2>
            <p className="text-sm text-muted-foreground">
              Your custom job templates
            </p>
          </div>
          {customTemplates.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">No custom templates yet</p>
                  <p className="text-sm mb-4">Create your first template to speed up job posting</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>

        {/* Preview Dialog */}
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{previewTemplate?.title}</DialogTitle>
              <DialogDescription>{previewTemplate?.templateName}</DialogDescription>
            </DialogHeader>
            {previewTemplate && (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Badge variant="outline">{previewTemplate.employmentType}</Badge>
                  <Badge variant="outline">{previewTemplate.department}</Badge>
                  <Badge variant="outline">{previewTemplate.experienceLevel}</Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {previewTemplate.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <ul className="space-y-1">
                    {previewTemplate.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Responsibilities</h3>
                  <ul className="space-y-1">
                    {previewTemplate.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    Use This Template
                  </Button>
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the template.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardPageLayout>
  );
}
