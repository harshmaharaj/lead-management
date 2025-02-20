import { supabase } from '../supabase'

export interface Status {
  id: string
  status_name: string
  status_color: string
  created_at: string
  updated_at: string
}

export interface CreateStatusData {
  status_name: string
  status_color: string
}

export const statusService = {
  async getAll() {
    const { data, error } = await supabase
      .from('lead_statuses')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as Status[]
  },

  async create(status: CreateStatusData) {
    const { data, error } = await supabase
      .from('lead_statuses')
      .insert([status])
      .select()
      .single()

    if (error) throw error
    return data as Status
  },

  async update(id: string, status: Partial<CreateStatusData>) {
    const { data, error } = await supabase
      .from('lead_statuses')
      .update({
        ...status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Status
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('lead_statuses')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 