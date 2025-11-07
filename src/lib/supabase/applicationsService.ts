import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/types/application';

export const applicationsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(*),
        candidate:candidates(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Application[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(*),
        candidate:candidates(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Application;
  },

  async getByJobId(jobId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(*),
        candidate:candidates(*)
      `)
      .eq('job_id', jobId)
      .order('applied_date', { ascending: false });
    
    if (error) throw error;
    return data as Application[];
  },

  async create(application: Omit<Application, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('applications')
      .insert([application])
      .select()
      .single();
    
    if (error) throw error;
    return data as Application;
  },

  async update(id: string, application: Partial<Application>) {
    const { data, error } = await supabase
      .from('applications')
      .update(application)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Application;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateStage(id: string, stage: string) {
    return this.update(id, { stage });
  },
};
