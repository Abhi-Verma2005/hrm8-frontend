/**
 * Job Application Form
 * Dynamic form based on job's applicationForm configuration
 */

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';
import { jobService, PublicJob } from '@/lib/jobService';
import { applicationService, SubmitApplicationRequest } from '@/lib/applicationService';
import { ApplicationFormConfig, ApplicationQuestion } from '@/types/applicationForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Upload, File, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface JobApplicationFormProps {
  jobId: string;
  onSuccess?: (applicationId: string) => void;
}

interface FileUpload {
  file: File;
  url: string; // Mock URL
}

export function JobApplicationForm({ jobId, onSuccess }: JobApplicationFormProps) {
  const [job, setJob] = useState<PublicJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, FileUpload>>({});
  const { candidate } = useCandidateAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    setIsLoading(true);
    try {
      const response = await jobService.getPublicJobById(jobId);
      setJob(response.data?.job || null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load job details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Build form schema dynamically
  const buildFormSchema = (config: ApplicationFormConfig) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    // Standard fields
    if (config.includeStandardFields.resume.included) {
      schemaFields.resume = config.includeStandardFields.resume.required
        ? z.any()
        : z.any().optional();
    }

    if (config.includeStandardFields.coverLetter.included) {
      schemaFields.coverLetter = config.includeStandardFields.coverLetter.required
        ? z.string().min(1, 'Cover letter is required')
        : z.string().optional().or(z.literal(''));
    }

    if (config.includeStandardFields.portfolio.included) {
      schemaFields.portfolio = config.includeStandardFields.portfolio.required
        ? z.any()
        : z.any().optional();
    }

    if (config.includeStandardFields.linkedIn.included) {
      schemaFields.linkedIn = config.includeStandardFields.linkedIn.required
        ? z.string().url('Invalid LinkedIn URL').min(1, 'LinkedIn URL is required')
        : z.string().url('Invalid LinkedIn URL').optional().or(z.literal(''));
    }

    if (config.includeStandardFields.website.included) {
      schemaFields.website = config.includeStandardFields.website.required
        ? z.string().url('Invalid website URL').min(1, 'Website URL is required')
        : z.string().url('Invalid website URL').optional().or(z.literal(''));
    }

    // Custom questions
    config.questions
      .sort((a, b) => a.order - b.order)
      .forEach((question) => {
        let fieldSchema: z.ZodTypeAny;

        switch (question.type) {
          case 'short_text':
          case 'long_text':
            fieldSchema = z.string();
            if (question.validation?.minLength) {
              fieldSchema = fieldSchema.min(question.validation.minLength, `Minimum ${question.validation.minLength} characters`);
            }
            if (question.validation?.maxLength) {
              fieldSchema = fieldSchema.max(question.validation.maxLength, `Maximum ${question.validation.maxLength} characters`);
            }
            if (question.validation?.pattern) {
              fieldSchema = fieldSchema.regex(new RegExp(question.validation.pattern), 'Invalid format');
            }
            if (!question.required) {
              fieldSchema = fieldSchema.optional();
            }
            break;

          case 'multiple_choice':
          case 'dropdown':
            fieldSchema = question.required
              ? z.string().min(1, 'Please select an option')
              : z.string().optional();
            break;

          case 'checkbox':
            fieldSchema = question.required
              ? z.array(z.string()).min(1, 'Please select at least one option')
              : z.array(z.string()).optional();
            break;

          case 'file_upload':
            // Mock file upload – accept any value so we don't block submission
            fieldSchema = question.required ? z.any() : z.any().optional();
            break;

          default:
            fieldSchema = z.string().optional();
        }

        schemaFields[`question_${question.id}`] = fieldSchema;
      });

    return z.object(schemaFields);
  };

  const normalizedFormConfig = useMemo<ApplicationFormConfig>(() => {
    return (job?.applicationForm as ApplicationFormConfig | undefined) || {
      id: `form-${Date.now()}`,
      name: 'Application Form',
      description: 'Please provide the required information to apply for this position.',
      questions: [],
      includeStandardFields: {
        resume: { included: true, required: true },
        coverLetter: { included: false, required: false },
        portfolio: { included: false, required: false },
        linkedIn: { included: false, required: false },
        website: { included: false, required: false },
      },
    };
  }, [job?.applicationForm]);

  const formSchema = useMemo(() => buildFormSchema(normalizedFormConfig), [normalizedFormConfig]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    register('resume');
    register('coverLetter');
    register('portfolio');
  }, [register]);

  const handleFileUpload = (fieldName: string, file: File | null) => {
    if (!file) {
      const newUploadedFiles = { ...uploadedFiles };
      delete newUploadedFiles[fieldName];
      setUploadedFiles(newUploadedFiles);
      setValue(fieldName, undefined);
      return;
    }

    // Generate mock URL
    const mockUrl = `mock://documents/${candidate?.id}/${jobId}/${Date.now()}-${file.name}`;
    setUploadedFiles({
      ...uploadedFiles,
      [fieldName]: { file, url: mockUrl },
    });
    setValue(fieldName, file);
  };

  const onSubmit = async (data: any) => {
    if (!job || !candidate) return;

    setIsSubmitting(true);
    try {
      // Prepare custom answers
      const customAnswers: Array<{ questionId: string; answer: string | string[] }> = [];
      if (normalizedFormConfig) {
        normalizedFormConfig.questions.forEach((question) => {
          const fieldName = `question_${question.id}`;
          const answer = data[fieldName];
          if (answer !== undefined && answer !== null && answer !== '') {
            customAnswers.push({
              questionId: question.id,
              answer: Array.isArray(answer) ? answer : String(answer),
            });
          }
        });
      }

      // Prepare application data
      const applicationData: SubmitApplicationRequest = {
        jobId: job.id,
        resumeUrl: uploadedFiles.resume?.url,
        coverLetterUrl: uploadedFiles.coverLetter?.url,
        portfolioUrl: uploadedFiles.portfolio?.url,
        linkedInUrl: data.linkedIn || undefined,
        websiteUrl: data.website || undefined,
        customAnswers: customAnswers.length > 0 ? customAnswers : undefined,
        questionnaireData: {
          jobMeta: {
            jobId: job.id,
            title: job.title,
            requirements: job.requirements || [],
            responsibilities: job.responsibilities || [],
          },
          standardFields: {
            resume: uploadedFiles.resume ? uploadedFiles.resume.file.name : undefined,
            coverLetter: data.coverLetter || undefined,
            portfolio: uploadedFiles.portfolio ? uploadedFiles.portfolio.file.name : undefined,
            linkedIn: data.linkedIn || undefined,
            website: data.website || undefined,
          },
          coverLetterMarkdown: data.coverLetter || undefined,
        },
      };

      const response = await applicationService.submitApplication(applicationData);

      toast({
        title: 'Application submitted!',
        description: 'Your application has been submitted successfully.',
      });

      if (onSuccess) {
        onSuccess(response.data?.application?.id || '');
      } else {
        navigate(`/candidate/applications/${response.data?.application?.id}/confirmation`);
      }
    } catch (error: any) {
      toast({
        title: 'Submission failed',
        description: error.response?.data?.error || 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowQuestion = (question: ApplicationQuestion) => {
    const logic = question.conditionalLogic;
    if (!logic?.enabled || !logic.dependsOnQuestionId || !logic.showWhen) {
      return true;
    }

    const dependencyField = `question_${logic.dependsOnQuestionId}`;
    const dependencyValue = watch(dependencyField);
    const { equals, contains, isEmpty, isNotEmpty } = logic.showWhen;

    const isValueEmpty =
      dependencyValue === undefined ||
      dependencyValue === null ||
      dependencyValue === '' ||
      (Array.isArray(dependencyValue) && dependencyValue.length === 0);

    if (equals !== undefined) {
      const expectedValues = Array.isArray(equals) ? equals : [equals];
      if (Array.isArray(dependencyValue)) {
        return dependencyValue.some((value) => expectedValues.includes(value));
      }
      return expectedValues.includes(dependencyValue);
    }

    if (contains !== undefined) {
      if (Array.isArray(dependencyValue)) {
        return dependencyValue.includes(contains);
      }
      if (typeof dependencyValue === 'string') {
        return dependencyValue.toLowerCase().includes(String(contains).toLowerCase());
      }
    }

    if (isEmpty) {
      return isValueEmpty;
    }

    if (isNotEmpty) {
      return !isValueEmpty;
    }

    return true;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const renderQuestion = (question: ApplicationQuestion) => {
    const fieldName = `question_${question.id}`;
    const isVisible = shouldShowQuestion(question);

    if (!isVisible) {
      return null;
    }

    const error = errors[fieldName];

    switch (question.type) {
      case 'short_text':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={fieldName}>
              {question.label}
              {question.required && <span className="text-destructive">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <Input
              id={fieldName}
              {...register(fieldName)}
              placeholder={question.label}
            />
            {error && <p className="text-sm text-destructive">{error.message as string}</p>}
          </div>
        );

      case 'long_text':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={fieldName}>
              {question.label}
              {question.required && <span className="text-destructive">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <Textarea
              id={fieldName}
              {...register(fieldName)}
              placeholder={question.label}
              rows={4}
            />
            {error && <p className="text-sm text-destructive">{error.message as string}</p>}
          </div>
        );

      case 'multiple_choice':
        return (
          <div key={question.id} className="space-y-2">
            <Label>
              {question.label}
              {question.required && <span className="text-destructive">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <RadioGroup
              value={watch(fieldName) || ''}
              onValueChange={(value) => setValue(fieldName, value)}
            >
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${fieldName}_${option.id}`} />
                  <Label htmlFor={`${fieldName}_${option.id}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-sm text-destructive">{error.message as string}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={question.id} className="space-y-2">
            <Label>
              {question.label}
              {question.required && <span className="text-destructive">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <div className="space-y-2">
              {question.options?.map((option) => {
                const checkboxFieldName = `${fieldName}_${option.id}`;
                const isChecked = watch(fieldName)?.includes(option.value) || false;
                return (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={checkboxFieldName}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const current = watch(fieldName) || [];
                        const newValue = checked
                          ? [...current, option.value]
                          : current.filter((v: string) => v !== option.value);
                        setValue(fieldName, newValue);
                      }}
                    />
                    <Label htmlFor={checkboxFieldName} className="font-normal">
                      {option.label}
                    </Label>
                  </div>
                );
              })}
            </div>
            {error && <p className="text-sm text-destructive">{error.message as string}</p>}
          </div>
        );

      case 'dropdown':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={fieldName}>
              {question.label}
              {question.required && <span className="text-destructive">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <Select
              value={watch(fieldName) || ''}
              onValueChange={(value) => setValue(fieldName, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error.message as string}</p>}
          </div>
        );

      case 'file_upload':
        return (
          <div key={question.id} className="space-y-2">
            <Label>
              {question.label}
              {question.required && <span className="text-destructive">*</span>}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept={question.validation?.fileTypes?.join(',')}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileUpload(fieldName, file);
                }}
              />
              {uploadedFiles[fieldName] && (
                <div className="flex items-center gap-2 text-sm">
                  <File className="h-4 w-4" />
                  <span>{uploadedFiles[fieldName].file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileUpload(fieldName, null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error.message as string}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for {job.title}</CardTitle>
        <CardDescription>
          {normalizedFormConfig?.description || 'Please fill out the application form below'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Location</p>
              <p className="font-medium">{job.location}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Employment Type</p>
              <p className="font-medium">{job.employmentType.replace(/_/g, ' ')}</p>
            </div>
            {job.department && (
              <div>
                <p className="text-xs uppercase text-muted-foreground">Department</p>
                <p className="font-medium">{job.department}</p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase text-muted-foreground">Work Arrangement</p>
              <p className="font-medium">{job.workArrangement.replace(/_/g, ' ')}</p>
            </div>
          </div>

          {(job.requirements?.length || 0) > 0 && (
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-2">Core Requirements</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {job.requirements!.map((req, idx) => (
                  <li key={`req-${idx}`}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {(job.responsibilities?.length || 0) > 0 && (
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-2">Responsibilities</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {job.responsibilities!.map((item, idx) => (
                  <li key={`resp-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Standard Fields */}
          {normalizedFormConfig.includeStandardFields.resume.included && (
            <div className="space-y-2">
              <Label htmlFor="resume">
                Resume / CV
                {normalizedFormConfig.includeStandardFields.resume.required && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleFileUpload('resume', file);
                  }}
                />
                {uploadedFiles.resume && (
                  <div className="flex items-center gap-2 text-sm">
                    <File className="h-4 w-4" />
                    <span>{uploadedFiles.resume.file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileUpload('resume', null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {errors.resume && (
                <p className="text-sm text-destructive">{errors.resume.message as string}</p>
              )}
            </div>
          )}

          {normalizedFormConfig.includeStandardFields.coverLetter.included && (
            <div className="space-y-2">
              <Label htmlFor="coverLetter">
                Cover Letter (Markdown supported)
                {normalizedFormConfig.includeStandardFields.coverLetter.required && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <p className="text-xs text-muted-foreground">
                You can use basic markdown (**, *, -, #) to format your cover letter.
              </p>
              <Textarea
                id="coverLetter"
                rows={6}
                placeholder="Write your cover letter here..."
                {...register('coverLetter')}
              />
              {errors.coverLetter && (
                <p className="text-sm text-destructive">{errors.coverLetter.message as string}</p>
              )}
            </div>
          )}

          {normalizedFormConfig.includeStandardFields.portfolio.included && (
            <div className="space-y-2">
              <Label htmlFor="portfolio">
                Portfolio
                {normalizedFormConfig.includeStandardFields.portfolio.required && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="portfolio"
                  type="file"
                  accept=".pdf,.zip"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleFileUpload('portfolio', file);
                  }}
                />
                {uploadedFiles.portfolio && (
                  <div className="flex items-center gap-2 text-sm">
                    <File className="h-4 w-4" />
                    <span>{uploadedFiles.portfolio.file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileUpload('portfolio', null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {errors.portfolio && (
                <p className="text-sm text-destructive">{errors.portfolio.message as string}</p>
              )}
            </div>
          )}

          {normalizedFormConfig.includeStandardFields.linkedIn.included && (
            <div className="space-y-2">
              <Label htmlFor="linkedIn">
                LinkedIn Profile URL
                {normalizedFormConfig.includeStandardFields.linkedIn.required && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <Input
                id="linkedIn"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                {...register('linkedIn')}
              />
              {errors.linkedIn && (
                <p className="text-sm text-destructive">{errors.linkedIn.message as string}</p>
              )}
            </div>
          )}

          {normalizedFormConfig.includeStandardFields.website.included && (
            <div className="space-y-2">
              <Label htmlFor="website">
                Personal Website / Portfolio URL
                {normalizedFormConfig.includeStandardFields.website.required && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                {...register('website')}
              />
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website.message as string}</p>
              )}
            </div>
          )}

          {/* Custom Questions */}
          {normalizedFormConfig.questions
            .sort((a, b) => a.order - b.order)
            .map((question) => renderQuestion(question))}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

