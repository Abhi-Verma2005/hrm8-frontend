import { useState, useEffect } from "react";
import { ApplicationQuestion, QuestionType, QuestionOption } from "@/types/applicationForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { questionTypeLabels, questionTypeIcons, needsOptions, getDefaultValidation } from "@/lib/applicationFormUtils";
import { Plus, X } from "lucide-react";

interface AddQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (question: ApplicationQuestion) => void;
  editQuestion?: ApplicationQuestion | null;
  nextOrder: number;
}

export function AddQuestionDialog({
  open,
  onOpenChange,
  onAdd,
  editQuestion,
  nextOrder,
}: AddQuestionDialogProps) {
  const [type, setType] = useState<QuestionType>('short_text');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (editQuestion) {
      setType(editQuestion.type);
      setLabel(editQuestion.label);
      setDescription(editQuestion.description || '');
      setRequired(editQuestion.required);
      setOptions(editQuestion.options || []);
    } else {
      resetForm();
    }
  }, [editQuestion, open]);

  const resetForm = () => {
    setType('short_text');
    setLabel('');
    setDescription('');
    setRequired(false);
    setOptions([]);
    setNewOption('');
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;

    const option: QuestionOption = {
      id: `option-${Date.now()}-${Math.random()}`,
      label: newOption.trim(),
      value: newOption.trim().toLowerCase().replace(/\s+/g, '_'),
    };

    setOptions([...options, option]);
    setNewOption('');
  };

  const handleRemoveOption = (optionId: string) => {
    setOptions(options.filter((opt) => opt.id !== optionId));
  };

  const handleSubmit = () => {
    if (!label.trim()) return;
    if (needsOptions(type) && options.length < 2) return;

    const question: ApplicationQuestion = {
      id: editQuestion?.id || `question-${Date.now()}`,
      type,
      label: label.trim(),
      description: description.trim() || undefined,
      required,
      options: needsOptions(type) ? options : undefined,
      validation: getDefaultValidation(type),
      order: editQuestion?.order || nextOrder,
    };

    onAdd(question);
    resetForm();
    onOpenChange(false);
  };

  const handleTypeChange = (newType: QuestionType) => {
    setType(newType);
    if (!needsOptions(newType)) {
      setOptions([]);
    }
  };

  const questionTypes: QuestionType[] = [
    'short_text',
    'long_text',
    'multiple_choice',
    'checkbox',
    'dropdown',
    'yes_no',
    'file_upload',
    'date',
    'number',
    'email',
    'phone',
    'url',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editQuestion ? 'Edit Question' : 'Add Question'}
          </DialogTitle>
          <DialogDescription>
            Configure the question details and validation rules
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((qType) => {
                  const Icon = questionTypeIcons[qType];
                  return (
                    <SelectItem key={qType} value={qType}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {questionTypeLabels[qType]}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-label">Question Label *</Label>
            <Input
              id="question-label"
              placeholder="e.g., Why are you interested in this role?"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-desc">Description (Optional)</Label>
            <Textarea
              id="question-desc"
              placeholder="Add helpful context or instructions for applicants"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="required-toggle">Required Question</Label>
            <Switch
              id="required-toggle"
              checked={required}
              onCheckedChange={setRequired}
            />
          </div>

          {needsOptions(type) && (
            <div className="space-y-2">
              <Label>Answer Options *</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6">
                      {index + 1}.
                    </span>
                    <Input
                      value={option.label}
                      disabled
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(option.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-6">
                    {options.length + 1}.
                  </span>
                  <Input
                    placeholder="Add an option"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddOption();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddOption}
                    disabled={!newOption.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {options.length < 2 && (
                  <p className="text-sm text-muted-foreground">
                    Add at least 2 options for this question type
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!label.trim() || (needsOptions(type) && options.length < 2)}
          >
            {editQuestion ? 'Update Question' : 'Add Question'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
