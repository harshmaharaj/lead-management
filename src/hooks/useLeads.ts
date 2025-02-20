import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLeads, createLead, updateLead, deleteLead } from '../services/api/leads'
import type { Lead } from '../services/api/leads'

export function useLeads() {
  const queryClient = useQueryClient()

  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads
  })

  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) => 
      updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    }
  })

  return {
    leads,
    isLoading,
    error,
    createLead: createMutation.mutateAsync,
    updateLead: updateMutation.mutateAsync,
    deleteLead: deleteMutation.mutateAsync
  }
} 