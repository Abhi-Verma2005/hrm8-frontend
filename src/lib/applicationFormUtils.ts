import { QuestionType } from '@/types/applicationForm';
import {
  Type,
  AlignLeft,
  ListChecks,
  CheckSquare,
  ChevronDown,
  CircleDot,
  FileUp,
  Calendar,
  Hash,
  Mail,
  Phone,
  Link,
} from 'lucide-react';

export const questionTypeIcons: Record<QuestionType, any> = {
  short_text: Type,
  long_text: AlignLeft,
  multiple_choice: ListChecks,
  checkbox: CheckSquare,
  dropdown: ChevronDown,
  yes_no: CircleDot,
  file_upload: FileUp,
  date: Calendar,
  number: Hash,
  email: Mail,
  phone: Phone,
  url: Link,
};

export const questionTypeLabels: Record<QuestionType, string> = {
  short_text: 'Short Text',
  long_text: 'Long Text',
  multiple_choice: 'Multiple Choice',
  checkbox: 'Checkboxes',
  dropdown: 'Dropdown',
  yes_no: 'Yes/No',
  file_upload: 'File Upload',
  date: 'Date',
  number: 'Number',
  email: 'Email',
  phone: 'Phone',
  url: 'URL',
};

export const getDefaultValidation = (type: QuestionType) => {
  switch (type) {
    case 'short_text':
      return { maxLength: 200 };
    case 'long_text':
      return { maxLength: 1000 };
    case 'number':
      return { minValue: 0 };
    case 'file_upload':
      return { fileTypes: ['pdf', 'doc', 'docx'], maxFileSize: 5 };
    default:
      return undefined;
  }
};

export const needsOptions = (type: QuestionType): boolean => {
  return ['multiple_choice', 'checkbox', 'dropdown'].includes(type);
};

export const reorderQuestions = (questions: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(questions);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  
  return result.map((q, index) => ({
    ...q,
    order: index + 1,
  }));
};
