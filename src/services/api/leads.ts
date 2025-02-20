import { supabase } from '../supabase/client'

export interface Lead {
  id: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation'
  name: string
  value: number
  company: string
  email: string
  assignedTo: string | null
  phone?: string | null
  createdAt: string
  updatedAt: string
}

// Dummy data generator
function generateDummyLeads(count: number): Lead[] {
  const statuses: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation']
  const companies = ['Tech Corp', 'Acme Inc', 'Global Ltd', 'Innovation Co', 'Future Systems']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `lead-${i + 1}`,
    name: `Lead ${i + 1}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    email: `contact${i + 1}@${companies[Math.floor(Math.random() * companies.length)].toLowerCase().replace(' ', '')}.com`,
    phone: `+1 ${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 10000)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    value: Math.floor(Math.random() * 50000) + 5000,
    assignedTo: 'Current User', // We'll update this with real user data later
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString()
  }))
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
    throw error
  }

  return data.map(lead => ({
    ...lead,
    assignedTo: lead.assigned_to,
    createdAt: lead.created_at,
    updatedAt: lead.updated_at
  }))
}

export async function createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      value: lead.value,
      assigned_to: lead.assignedTo
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating lead:', error)
    throw error
  }

  return {
    ...data,
    assignedTo: data.assigned_to,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function updateLead(id: string, lead: Partial<Lead>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .update({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      value: lead.value,
      assigned_to: lead.assignedTo
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating lead:', error)
    throw error
  }

  return {
    ...data,
    assignedTo: data.assigned_to,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting lead:', error)
    throw error
  }
} 