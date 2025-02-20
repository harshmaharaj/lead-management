import { supabase } from '../supabase/client'

export interface Deal {
  id: string
  lead_id: string
  amount: number
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  expected_close_date: string
  owner_id: string
  products?: string[]
  lost_reason?: string
  won_date?: string
  created_at: string
  updated_at: string
}

export async function getDeals() {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      lead:leads(first_name, last_name),
      owner:users(full_name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as (Deal & {
    lead: { first_name: string; last_name: string }
    owner: { full_name: string }
  })[]
}

export async function createDeal(deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('deals')
    .insert([deal])
    .select()
    .single()

  if (error) throw error
  return data as Deal
}

export async function updateDeal(id: string, deal: Partial<Deal>) {
  const { data, error } = await supabase
    .from('deals')
    .update(deal)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Deal
}

export async function deleteDeal(id: string) {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id)

  if (error) throw error
} 