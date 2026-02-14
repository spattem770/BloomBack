import { supabase } from '../utils/supabase';

export type Bloom = {
  id: string;
  created_at: string;
  user_id: string;
  recipient_name: string | null;
  sender_name: string | null;
  sender_email: string | null;
  message: string | null;
  photo_url: string | null;
  tree_seed: number;
  tree_growth_stage: number;
};

/**
 * Fetch all blooms for the currently authenticated user
 */
export async function fetchMyBlooms(): Promise<Bloom[]> {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) throw authErr;
  if (!authData.user) throw new Error('Not logged in');

  const { data, error } = await supabase
    .from('blooms')
    .select('*')
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Bloom[];
}

/**
 * Create a new bloom for the currently authenticated user
 */
export async function createBloom(input: {
  recipient_name?: string;
  sender_name?: string;
  sender_email?: string;
  message?: string;
  photo_url?: string | null;
}): Promise<Bloom> {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) throw authErr;
  if (!authData.user) throw new Error('Not logged in');

  const newBloom = {
    user_id: authData.user.id,
    recipient_name: input.recipient_name ?? null,
    sender_name: input.sender_name ?? null,
    sender_email: input.sender_email ?? null,
    message: input.message ?? null,
    photo_url: input.photo_url ?? null,
    tree_seed: Math.random(),
    tree_growth_stage: 0,
  };

  const { data, error } = await supabase
    .from('blooms')
    .insert(newBloom)
    .select()
    .single();

  if (error) throw error;
  return data as Bloom;
}

/**
 * Fetch a specific bloom by user_id and bloom id
 */
export async function fetchBloom(userId: string, bloomId: string): Promise<Bloom> {
  const { data, error } = await supabase
    .from('blooms')
    .select('*')
    .eq('user_id', userId)
    .eq('id', bloomId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Bloom not found');
  
  return data as Bloom;
}
