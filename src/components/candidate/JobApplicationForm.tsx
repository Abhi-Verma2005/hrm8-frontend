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
import { applicationUploadService } from '@/lib/applicationUploadService';
import { ApplicationFormConfig, ApplicationQuestion } from '@/types/applicationForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Upload, File, X, Building2, MapPin, Briefcase, Clock, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JobApplicationFormProps {
  jobId: string;
  onSuccess?: (applicationId: string) => void;
}

interface FileUpload {
  file: File;
  url: string; // Cloudinary URL
  publicId?: string; // Cloudinary public ID for deletion
  isUploading?: boolean;
  uploadError?: string;
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

  const handleFileUpload = async (fieldName: string, file: File | null) => {
    if (!file) {
      // Delete file from Cloudinary if it exists
      const existingFile = uploadedFiles[fieldName];
      if (existingFile?.publicId) {
        try {
          await applicationUploadService.deleteFile(existingFile.publicId);
        } catch (error) {
          console.error('Failed to delete file from Cloudinary:', error);
        }
      }

      const newUploadedFiles = { ...uploadedFiles };
      delete newUploadedFiles[fieldName];
      setUploadedFiles(newUploadedFiles);
      setValue(fieldName, undefined);
      return;
    }

    // Determine file type based on field name
    let fileType: 'resume' | 'coverLetter' | 'portfolio' = 'resume';
    if (fieldName === 'coverLetter') fileType = 'coverLetter';
    if (fieldName === 'portfolio') fileType = 'portfolio';
    if (fieldName.startsWith('question_')) fileType = 'resume'; // Default for custom questions

    // Set uploading state
    setUploadedFiles({
      ...uploadedFiles,
      [fieldName]: { file, url: '', isUploading: true },
    });

    try {
      // Upload to Cloudinary
      const uploadResult = await applicationUploadService.uploadFile(file, fileType);

      setUploadedFiles({
        ...uploadedFiles,
        [fieldName]: {
          file,
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          isUploading: false,
        },
      });
      setValue(fieldName, file);
    } catch (error) {
      console.error('File upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      
      setUploadedFiles({
        ...uploadedFiles,
        [fieldName]: {
          file,
          url: '',
          isUploading: false,
          uploadError: errorMessage,
        },
      });

      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: any) => {
    if (!job || !candidate) return;

    // Validate all required questions are answered
    const unansweredRequiredQuestions: string[] = [];
    if (normalizedFormConfig) {
      normalizedFormConfig.questions.forEach((question) => {
        if (question.required && shouldShowQuestion(question)) {
          const fieldName = `question_${question.id}`;
          
          // Handle file upload questions
          if (question.type === 'file_upload') {
            const fileUpload = uploadedFiles[fieldName];
            if (!fileUpload) {
              unansweredRequiredQuestions.push(question.label);
            } else if (fileUpload.isUploading) {
              toast({
                title: 'Please wait',
                description: `${question.label} is still uploading. Please wait for it to complete.`,
                variant: 'destructive',
              });
              return;
            } else if (fileUpload.uploadError || !fileUpload.url) {
              unansweredRequiredQuestions.push(`${question.label} (upload failed)`);
            }
          } else {
            // Handle other question types
            const answer = data[fieldName];
            const isEmpty = answer === undefined || answer === null || answer === '' || 
                           (Array.isArray(answer) && answer.length === 0);
            if (isEmpty) {
              unansweredRequiredQuestions.push(question.label);
            }
          }
        }
      });
    }

    // Check required standard fields and upload status
    if (normalizedFormConfig.includeStandardFields.resume.required) {
      if (!uploadedFiles.resume) {
        unansweredRequiredQuestions.push('Resume / CV');
      } else if (uploadedFiles.resume.isUploading) {
        toast({
          title: 'Please wait',
          description: 'Resume is still uploading. Please wait for it to complete.',
          variant: 'destructive',
        });
        return;
      } else if (uploadedFiles.resume.uploadError || !uploadedFiles.resume.url) {
        unansweredRequiredQuestions.push('Resume / CV (upload failed)');
      }
    }
    if (normalizedFormConfig.includeStandardFields.coverLetter.required && !data.coverLetter?.trim()) {
      unansweredRequiredQuestions.push('Cover Letter');
    }
    if (normalizedFormConfig.includeStandardFields.portfolio.required) {
      if (!uploadedFiles.portfolio) {
        unansweredRequiredQuestions.push('Portfolio');
      } else if (uploadedFiles.portfolio.isUploading) {
        toast({
          title: 'Please wait',
          description: 'Portfolio is still uploading. Please wait for it to complete.',
          variant: 'destructive',
        });
        return;
      } else if (uploadedFiles.portfolio.uploadError || !uploadedFiles.portfolio.url) {
        unansweredRequiredQuestions.push('Portfolio (upload failed)');
      }
    }
    if (normalizedFormConfig.includeStandardFields.linkedIn.required && !data.linkedIn?.trim()) {
      unansweredRequiredQuestions.push('LinkedIn Profile URL');
    }
    if (normalizedFormConfig.includeStandardFields.website.required && !data.website?.trim()) {
      unansweredRequiredQuestions.push('Personal Website / Portfolio URL');
    }

    if (unansweredRequiredQuestions.length > 0) {
      toast({
        title: 'Please complete all required fields',
        description: `The following fields are required: ${unansweredRequiredQuestions.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare custom answers - include ALL questions, even if empty (for optional ones)
      const customAnswers: Array<{ questionId: string; answer: string | string[] }> = [];
      if (normalizedFormConfig) {
        normalizedFormConfig.questions.forEach((question) => {
          const fieldName = `question_${question.id}`;
          const answer = data[fieldName];
          // Include all answers, even empty optional ones
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

      if (!response.success) {
        toast({
          title: 'Submission failed',
          description: response.error || 'Failed to submit application. Please try again.',
          variant: 'destructive',
        });
        return;
      }

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
        description: error?.message || 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) {
      return job.salaryDescription || 'Salary not specified';
    }
    const min = job.salaryMin?.toLocaleString();
    const max = job.salaryMax?.toLocaleString();
    return `${job.salaryCurrency} ${min}${max ? ` - ${max}` : '+'}`;
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
          <div key={question.id} className="space-y-2 p-4 border rounded-lg bg-card">
            <Label htmlFor={fieldName} className="text-base font-semibold">
              {question.label}
              {question.required && <span className="text-destructive ml-1">*</span>}
              {question.required && (
                <span className="text-xs text-muted-foreground ml-2">(Required)</span>
              )}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
            )}
            <Input
              id={fieldName}
              {...register(fieldName)}
              placeholder={question.label}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error.message as string}</p>}
          </div>
        );

      case 'long_text':
        return (
          <div key={question.id} className="space-y-2 p-4 border rounded-lg bg-card">
            <Label htmlFor={fieldName} className="text-base font-semibold">
              {question.label}
              {question.required && <span className="text-destructive ml-1">*</span>}
              {question.required && (
                <span className="text-xs text-muted-foreground ml-2">(Required)</span>
              )}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
            )}
            <Textarea
              id={fieldName}
              {...register(fieldName)}
              placeholder={question.label}
              rows={4}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error.message as string}</p>}
          </div>
        );

      case 'multiple_choice':
        return (
          <div key={question.id} className="space-y-2 p-4 border rounded-lg bg-card">
            <Label className="text-base font-semibold">
              {question.label}
              {question.required && <span className="text-destructive ml-1">*</span>}
              {question.required && (
                <span className="text-xs text-muted-foreground ml-2">(Required)</span>
              )}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
            )}
            <RadioGroup
              value={watch(fieldName) || ''}
              onValueChange={(value) => setValue(fieldName, value)}
              className={error ? 'border-destructive' : ''}
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
          <div key={question.id} className="space-y-2 p-4 border rounded-lg bg-card">
            <Label className="text-base font-semibold">
              {question.label}
              {question.required && <span className="text-destructive ml-1">*</span>}
              {question.required && (
                <span className="text-xs text-muted-foreground ml-2">(Required)</span>
              )}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
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
          <div key={question.id} className="space-y-2 p-4 border rounded-lg bg-card">
            <Label htmlFor={fieldName} className="text-base font-semibold">
              {question.label}
              {question.required && <span className="text-destructive ml-1">*</span>}
              {question.required && (
                <span className="text-xs text-muted-foreground ml-2">(Required)</span>
              )}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
            )}
            <Select
              value={watch(fieldName) || ''}
              onValueChange={(value) => setValue(fieldName, value)}
            >
              <SelectTrigger className={error ? 'border-destructive' : ''}>
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
          <div key={question.id} className="space-y-2 p-4 border rounded-lg bg-card">
            <Label className="text-base font-semibold">
              {question.label}
              {question.required && <span className="text-destructive ml-1">*</span>}
              {question.required && (
                <span className="text-xs text-muted-foreground ml-2">(Required)</span>
              )}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
            )}
            <div className="space-y-2">
              <Input
                type="file"
                accept={question.validation?.fileTypes?.join(',')}
                disabled={uploadedFiles[fieldName]?.isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileUpload(fieldName, file);
                }}
                className={error ? 'border-destructive' : ''}
              />
              {uploadedFiles[fieldName] && (
                <div className="flex items-center gap-2 text-sm p-2 border rounded-md bg-muted/50">
                  {uploadedFiles[fieldName].isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-muted-foreground">Uploading {uploadedFiles[fieldName].file.name}...</span>
                    </>
                  ) : uploadedFiles[fieldName].uploadError ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-destructive">{uploadedFiles[fieldName].uploadError}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileUpload(fieldName, null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : uploadedFiles[fieldName].url ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <File className="h-4 w-4" />
                      <span className="font-medium">{uploadedFiles[fieldName].file.name}</span>
                      <span className="text-xs text-muted-foreground">(Uploaded)</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileUpload(fieldName, null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error.message as string}</p>}
            {uploadedFiles[fieldName]?.uploadError && (
              <p className="text-sm text-destructive">{uploadedFiles[fieldName].uploadError}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const requiredQuestionsCount = normalizedFormConfig.questions.filter(q => q.required && shouldShowQuestion(q)).length;
  const requiredStandardFieldsCount = [
    normalizedFormConfig.includeStandardFields.resume.required,
    normalizedFormConfig.includeStandardFields.coverLetter.required,
    normalizedFormConfig.includeStandardFields.portfolio.required,
    normalizedFormConfig.includeStandardFields.linkedIn.required,
    normalizedFormConfig.includeStandardFields.website.required,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Comprehensive Job Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Job Details</CardTitle>
          <CardDescription>Review all job information before applying</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Header */}
          <div>
            <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
            <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {job.company.name}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {job.employmentType.replace(/_/g, ' ')}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatSalary()}
              </span>
              {job.postingDate && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {new Date(job.postingDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-1">Employment Type</p>
              <p className="font-medium">{job.employmentType.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-1">Work Arrangement</p>
              <p className="font-medium">{job.workArrangement.replace(/_/g, ' ')}</p>
            </div>
            {job.department && (
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-1">Department</p>
                <p className="font-medium">{job.department}</p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-1">Number of Vacancies</p>
              <p className="font-medium">{job.numberOfVacancies}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-1">Salary</p>
              <p className="font-medium">{formatSalary()}</p>
            </div>
            {job.company.website && (
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-1">Company Website</p>
                <a 
                  href={job.company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {job.company.website}
                </a>
              </div>
            )}
          </div>

          {/* Full Job Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-sm">{job.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {(job.requirements?.length || 0) > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {job.requirements.map((req, idx) => (
                  <li key={`req-${idx}`}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {(job.responsibilities?.length || 0) > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {job.responsibilities.map((item, idx) => (
                  <li key={`resp-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Promotional Tags */}
          {(job.promotionalTags?.length || 0) > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex gap-2 flex-wrap">
                {job.promotionalTags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-muted rounded-md text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <CardDescription>
            {normalizedFormConfig?.description || 'Please fill out the application form below'}
            {(requiredQuestionsCount > 0 || requiredStandardFieldsCount > 0) && (
              <span className="block mt-2 text-sm text-muted-foreground">
                {requiredStandardFieldsCount + requiredQuestionsCount} required field(s) must be completed
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

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
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    disabled={uploadedFiles.resume?.isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileUpload('resume', file);
                    }}
                  />
                </div>
                {uploadedFiles.resume && (
                  <div className="flex items-center gap-2 text-sm p-2 border rounded-md bg-muted/50">
                    {uploadedFiles.resume.isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-muted-foreground">Uploading {uploadedFiles.resume.file.name}...</span>
                      </>
                    ) : uploadedFiles.resume.uploadError ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-destructive">{uploadedFiles.resume.uploadError}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileUpload('resume', null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : uploadedFiles.resume.url ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <File className="h-4 w-4" />
                        <span className="font-medium">{uploadedFiles.resume.file.name}</span>
                        <span className="text-xs text-muted-foreground">(Uploaded)</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileUpload('resume', null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="portfolio"
                    type="file"
                    accept=".pdf,.zip"
                    disabled={uploadedFiles.portfolio?.isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileUpload('portfolio', file);
                    }}
                  />
                </div>
                {uploadedFiles.portfolio && (
                  <div className="flex items-center gap-2 text-sm p-2 border rounded-md bg-muted/50">
                    {uploadedFiles.portfolio.isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-muted-foreground">Uploading {uploadedFiles.portfolio.file.name}...</span>
                      </>
                    ) : uploadedFiles.portfolio.uploadError ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-destructive">{uploadedFiles.portfolio.uploadError}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileUpload('portfolio', null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : uploadedFiles.portfolio.url ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <File className="h-4 w-4" />
                        <span className="font-medium">{uploadedFiles.portfolio.file.name}</span>
                        <span className="text-xs text-muted-foreground">(Uploaded)</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileUpload('portfolio', null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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

          {/* Custom Questions Section */}
          {normalizedFormConfig.questions.length > 0 && (
            <div className="space-y-6">
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Application Questions
                  {requiredQuestionsCount > 0 && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({requiredQuestionsCount} required)
                    </span>
                  )}
                </h3>
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please answer all required questions. Your responses will be reviewed as part of your application.
                  </AlertDescription>
                </Alert>
              </div>
              <div className="space-y-6">
                {normalizedFormConfig.questions
                  .sort((a, b) => a.order - b.order)
                  .map((question) => renderQuestion(question))}
              </div>
            </div>
          )}

          {/* Submission Section */}
          <div className="border-t pt-6 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please review all your answers before submitting. Once submitted, you cannot edit your application.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} size="lg" className="flex-1">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}

