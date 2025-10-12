import { UseFormReturn } from "react-hook-form";
import { JobFormData } from "@/types/job";
import { ApplicationQuestion } from "@/types/applicationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ApplicationQuestionCard } from "./ApplicationQuestionCard";
import { AddQuestionDialog } from "./AddQuestionDialog";
import { ApplicationFormPreview } from "./ApplicationFormPreview";
import { useState } from "react";
import { FileQuestion, Plus, Eye, FileStack } from "lucide-react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { reorderQuestions } from "@/lib/applicationFormUtils";

interface JobWizardStep4Props {
  form: UseFormReturn<JobFormData>;
}

export function JobWizardStep4({ form }: JobWizardStep4Props) {
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ApplicationQuestion | null>(null);

  const questions = form.watch('applicationForm.questions') || [];
  const standardFields = form.watch('applicationForm.includeStandardFields');

  const handleAddQuestion = (question: ApplicationQuestion) => {
    const currentQuestions = form.getValues('applicationForm.questions') || [];
    
    if (editingQuestion) {
      // Update existing question
      const updatedQuestions = currentQuestions.map((q) =>
        q.id === question.id ? question : q
      );
      form.setValue('applicationForm.questions', updatedQuestions);
      setEditingQuestion(null);
    } else {
      // Add new question
      form.setValue('applicationForm.questions', [...currentQuestions, question]);
    }
  };

  const handleEditQuestion = (question: ApplicationQuestion) => {
    setEditingQuestion(question);
    setQuestionDialogOpen(true);
  };

  const handleDuplicateQuestion = (question: ApplicationQuestion) => {
    const duplicate: ApplicationQuestion = {
      ...question,
      id: `question-${Date.now()}`,
      order: questions.length + 1,
    };
    form.setValue('applicationForm.questions', [...questions, duplicate]);
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = questions
      .filter((q) => q.id !== questionId)
      .map((q, index) => ({ ...q, order: index + 1 }));
    form.setValue('applicationForm.questions', updatedQuestions);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    const reordered = reorderQuestions(questions, oldIndex, newIndex);
    form.setValue('applicationForm.questions', reordered);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileQuestion className="h-6 w-6" />
          Application Form & Questionnaire
        </h2>
        <p className="text-muted-foreground mt-1">
          Configure what information you want from applicants
        </p>
      </div>

      {/* Standard Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Fields</CardTitle>
          <CardDescription>
            Select the standard information you want to collect from applicants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="applicationForm.includeStandardFields.resume"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Resume/CV (Required)</FormLabel>
                  <FormDescription>
                    Applicants must upload their resume or CV
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationForm.includeStandardFields.coverLetter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Cover Letter</FormLabel>
                  <FormDescription>
                    Request a cover letter from applicants
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationForm.includeStandardFields.portfolio"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Portfolio/Work Samples</FormLabel>
                  <FormDescription>
                    Request a link to portfolio or work samples
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationForm.includeStandardFields.linkedIn"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormDescription>
                    Request applicant's LinkedIn profile URL
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationForm.includeStandardFields.website"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Personal Website</FormLabel>
                  <FormDescription>
                    Request applicant's personal website or blog
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Custom Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Questions</CardTitle>
          <CardDescription>
            Add custom questions to gather additional information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <FileStack className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                No custom questions added yet
              </p>
              <Button onClick={() => setQuestionDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Question
              </Button>
            </div>
          ) : (
            <>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={questions.map((q) => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {questions
                      .sort((a, b) => a.order - b.order)
                      .map((question) => (
                        <ApplicationQuestionCard
                          key={question.id}
                          question={question}
                          onEdit={handleEditQuestion}
                          onDuplicate={handleDuplicateQuestion}
                          onDelete={handleDeleteQuestion}
                        />
                      ))}
                  </div>
                </SortableContext>
              </DndContext>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEditingQuestion(null);
                  setQuestionDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </>
          )}

          <div className="flex justify-end pt-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Application Form
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Application Form Preview</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ApplicationFormPreview formConfig={form.watch('applicationForm')} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      <AddQuestionDialog
        open={questionDialogOpen}
        onOpenChange={(open) => {
          setQuestionDialogOpen(open);
          if (!open) setEditingQuestion(null);
        }}
        onAdd={handleAddQuestion}
        editQuestion={editingQuestion}
        nextOrder={questions.length + 1}
      />
    </div>
  );
}
