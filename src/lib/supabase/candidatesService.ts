import { supabase } from '@/integrations/supabase/client';
import { Candidate } from '@/types/candidate';

export const candidatesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Candidate[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Candidate;
  },

  async create(candidate: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('candidates')
      .insert([candidate])
      .select()
      .single();
    
    if (error) throw error;
    return data as Candidate;
  },

  async update(id: string, candidate: Partial<Candidate>) {
    const { data, error } = await supabase
      .from('candidates')
      .update(candidate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Candidate;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
