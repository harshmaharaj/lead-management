export interface Lead {
  id: string
  name: string
  company: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation'
  value: number
  createdAt: string
}

export interface DashboardMetrics {
  totalLeads: number
  activeDeals: number
  conversionRate: number
  totalRevenue: number
  recentLeads: Lead[]
}

// Dummy data generator
function generateDummyData(): DashboardMetrics {
  const statuses: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation']
  const companies = ['Tech Corp', 'Acme Inc', 'Global Ltd', 'Innovation Co', 'Future Systems']
  
  const recentLeads: Lead[] = Array.from({ length: 10 }, (_, i) => ({
    id: `lead-${i + 1}`,
    name: `Lead ${i + 1}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    value: Math.floor(Math.random() * 50000) + 5000,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
  }))

  return {
    totalLeads: 234,
    activeDeals: 45,
    conversionRate: 32,
    totalRevenue: 450000,
    recentLeads
  }
}

// Simulated API call
export async function getDashboardData(): Promise<DashboardMetrics> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return generateDummyData()
} 