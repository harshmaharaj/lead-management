import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation']),
  value: z.number().min(0, 'Value must be positive'),
  assignedTo: z.string().nullable()
})

export type LeadFormData = z.infer<typeof leadSchema> 