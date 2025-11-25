/**
 * Job Application Form
 * Dynamic form based on job's applicationForm configuration
 */

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
  const buildFormSchema = (config: ApplicationFormConfig | undefined) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    if (!config) {
      // Default schema with just resume
      schemaFields.resume = z.instanceof(File, { message: 'Resume is required' });
      return z.object(schemaFields);
    }

    // Standard fields
    if (config.includeStandardFields.resume.included) {
      schemaFields.resume = config.includeStandardFields.resume.required
        ? z.instanceof(File, { message: 'Resume is required' })
        : z.instanceof(File).optional();
    }

    if (config.includeStandardFields.coverLetter.included) {
      schemaFields.coverLetter = config.includeStandardFields.coverLetter.required
        ? z.string().min(1, 'Cover letter is required')
        : z.string().optional();
    }

    if (config.includeStandardFields.portfolio.included) {
      schemaFields.portfolio = config.includeStandardFields.portfolio.required
        ? z.instanceof(File, { message: 'Portfolio is required' })
        : z.instanceof(File).optional();
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
            fieldSchema = question.required
              ? z.instanceof(File, { message: 'File is required' })
              : z.instanceof(File).optional();
            break;

          default:
            fieldSchema = z.string().optional();
        }

        schemaFields[`question_${question.id}`] = fieldSchema;
      });

    return z.object(schemaFields);
  };

  const formConfig = job?.applicationForm as ApplicationFormConfig | undefined;
  const formSchema = buildFormSchema(formConfig);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

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
      if (formConfig) {
        formConfig.questions.forEach((question) => {
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
        coverLetterUrl: data.coverLetter ? `mock://documents/${candidate.id}/${jobId}/cover-letter-${Date.now()}.txt` : undefined,
        portfolioUrl: uploadedFiles.portfolio?.url,
        linkedInUrl: data.linkedIn || undefined,
        websiteUrl: data.website || undefined,
        customAnswers: customAnswers.length > 0 ? customAnswers : undefined,
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
          {formConfig?.description || 'Please fill out the application form below'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Standard Fields */}
          {formConfig?.includeStandardFields.resume.included && (
            <div className="space-y-2">
              <Label htmlFor="resume">
                Resume / CV
                {formConfig.includeStandardFields.resume.required && (
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

          {formConfig?.includeStandardFields.coverLetter.included && (
            <div className="space-y-2">
              <Label htmlFor="coverLetter">
                Cover Letter
                {formConfig.includeStandardFields.coverLetter.required && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <Textarea
                id="coverLetter"
                {...register('coverLetter')}
                placeholder="Write your cover letter here..."
                rows={6}
              />
              {errors.coverLetter && (
                <p className="text-sm text-destructive">{errors.coverLetter.message as string}</p>
              )}
            </div>
          )}

          {formConfig?.includeStandardFields.portfolio.included && (
            <div className="space-y-2">
              <Label htmlFor="portfolio">
                Portfolio
                {formConfig.includeStandardFields.portfolio.required && (
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

          {formConfig?.includeStandardFields.linkedIn.included && (
            <div className="space-y-2">
              <Label htmlFor="linkedIn">
                LinkedIn Profile URL
                {formConfig.includeStandardFields.linkedIn.required && (
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

          {formConfig?.includeStandardFields.website.included && (
            <div className="space-y-2">
              <Label htmlFor="website">
                Personal Website / Portfolio URL
                {formConfig.includeStandardFields.website.required && (
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
          {formConfig?.questions
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

