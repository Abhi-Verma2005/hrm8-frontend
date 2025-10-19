export type QuestionType = 
  | 'short_text' 
  | 'long_text' 
  | 'multiple_choice' 
  | 'checkbox' 
  | 'dropdown' 
  | 'yes_no' 
  | 'file_upload' 
  | 'date' 
  | 'number'
  | 'email'
  | 'phone'
  | 'url';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface ApplicationQuestion {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    fileTypes?: string[];
    maxFileSize?: number;
  };
  order: number;
}

export interface ApplicationFormConfig {
  id: string;
  name: string;
  description?: string;
  questions: ApplicationQuestion[];
  includeStandardFields: {
    resume: { included: boolean; required: boolean };
    coverLetter: { included: boolean; required: boolean };
    portfolio: { included: boolean; required: boolean };
    linkedIn: { included: boolean; required: boolean };
    website: { included: boolean; required: boolean };
  };
}

export interface LibraryQuestion extends ApplicationQuestion {
  libraryId: string;
  isSystemTemplate: boolean;
  savedAt?: string;
  usageCount?: number;
  category?: string;
}
