/**
 * Job Description Service
 * Handles AI-powered job description generation using all available form fields
 */

import { apiClient } from '../api';
import { JobFormData } from '@/types/job';

export interface GenerateDescriptionRequest {
  // Step 1
  title: string;
  numberOfVacancies?: number;
  department?: string;
  location?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'casual';
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  workArrangement?: 'on-site' | 'remote' | 'hybrid';
  tags?: string[];
  serviceType?: 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search' | 'rpo';
  
  // Step 2 (if partially filled)
  existingDescription?: string;
  existingRequirements?: string[];
  existingResponsibilities?: string[];
  
  // Step 3 (if available)
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annual';
  salaryDescription?: string;
  hideSalary?: boolean;
  closeDate?: string;
  visibility?: 'public' | 'private';
  stealth?: boolean;
  
  // Additional context
  additionalContext?: string;
}

export interface GeneratedJobDescription {
  description: string;
  requirements: string[];
  responsibilities: string[];
}

export const jobDescriptionService = {
  /**
   * Generate job description using ALL available form fields
   */
  async generateDescription(formData: Partial<JobFormData>, additionalContext?: string): Promise<GeneratedJobDescription> {
    // Extract requirements and responsibilities as string arrays
    const existingRequirements = formData.requirements?.map(r => 
      typeof r === 'string' ? r : r.text
    ).filter(Boolean);
    
    const existingResponsibilities = formData.responsibilities?.map(r => 
      typeof r === 'string' ? r : r.text
    ).filter(Boolean);

    const request: GenerateDescriptionRequest = {
      // Step 1
      title: formData.title || '',
      numberOfVacancies: formData.numberOfVacancies,
      department: formData.department,
      location: formData.location,
      employmentType: formData.employmentType,
      experienceLevel: formData.experienceLevel,
      workArrangement: formData.workArrangement,
      tags: formData.tags,
      serviceType: formData.serviceType,
      
      // Step 2 (if partially filled)
      existingDescription: formData.description,
      existingRequirements: existingRequirements && existingRequirements.length > 0 ? existingRequirements : undefined,
      existingResponsibilities: existingResponsibilities && existingResponsibilities.length > 0 ? existingResponsibilities : undefined,
      
      // Step 3 (if available)
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
      salaryCurrency: formData.salaryCurrency,
      salaryPeriod: formData.salaryPeriod,
      salaryDescription: formData.salaryDescription,
      hideSalary: formData.hideSalary,
      closeDate: formData.closeDate,
      visibility: formData.visibility,
      stealth: formData.stealth,
      
      // Additional context
      additionalContext,
    };

    console.log('🚀 Calling /api/jobs/generate-description with:', request);
    
    const response = await apiClient.post<{ success: boolean; data: GeneratedJobDescription; error?: string }>(
      '/api/jobs/generate-description',
      request
    );
    
    console.log('📥 Raw API Response:', JSON.stringify(response, null, 2));
    
    if (!response.success) {
      console.error('❌ API Error - success is false:', response.error);
      throw new Error(response.error || 'Failed to generate job description');
    }
    
    if (!response.data) {
      console.error('❌ API Error - no data in response');
      throw new Error('No data in response');
    }
    
    // Backend returns { success: true, data: GeneratedJobDescription }
    // apiClient returns { success: true, data: { success: true, data: GeneratedJobDescription } }
    // So we need to access response.data.data
    const backendResponse = response.data as { success?: boolean; data?: GeneratedJobDescription; error?: string };
    
    console.log('📦 Backend Response:', JSON.stringify(backendResponse, null, 2));
    
    // Check if it's the nested structure
    let generated: GeneratedJobDescription;
    
    // First check if backendResponse itself has the structure we need
    if (backendResponse && typeof backendResponse === 'object') {
      // Check for nested structure: { success: true, data: GeneratedJobDescription }
      if ('data' in backendResponse && backendResponse.data) {
        const nestedData = backendResponse.data;
        if (typeof nestedData === 'object' && 'description' in nestedData) {
          console.log('✅ Found nested structure, using response.data.data');
          generated = nestedData as GeneratedJobDescription;
        } else {
          console.error('❌ Nested data is not GeneratedJobDescription:', nestedData);
          throw new Error('Invalid nested response format');
        }
      } 
      // Check if backendResponse itself is the GeneratedJobDescription
      else if ('description' in backendResponse && 'requirements' in backendResponse && 'responsibilities' in backendResponse) {
        console.log('✅ Found direct structure, using response.data directly');
        generated = backendResponse as GeneratedJobDescription;
      } else {
        console.error('❌ Unexpected response structure:', JSON.stringify(backendResponse, null, 2));
        throw new Error('Invalid response format from job description generation API');
      }
    } else {
      console.error('❌ Backend response is not an object:', backendResponse);
      throw new Error('Invalid response format');
    }
    
    console.log('✅ Extracted Generated Data:', JSON.stringify(generated, null, 2));
    
    if (!generated) {
      console.error('❌ Generated is null/undefined');
      throw new Error('Failed to extract generated data');
    }
    
    if (!generated.description) {
      console.error('❌ Generated description is missing');
      throw new Error('Generated description is missing');
    }
    
    if (!Array.isArray(generated.requirements)) {
      console.error('❌ Generated requirements is not an array:', generated.requirements);
      throw new Error('Generated requirements is not an array');
    }
    
    if (!Array.isArray(generated.responsibilities)) {
      console.error('❌ Generated responsibilities is not an array:', generated.responsibilities);
      throw new Error('Generated responsibilities is not an array');
    }
    
    console.log('✅ Validation passed, returning generated data');
    return generated;
  },
};

