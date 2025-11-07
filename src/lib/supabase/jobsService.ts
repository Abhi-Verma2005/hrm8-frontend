import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/job';

export const jobsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Job[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Job;
  },

  async create(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...job, created_by: user?.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Job;
  },

  async update(id: string, job: Partial<Job>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Job;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
