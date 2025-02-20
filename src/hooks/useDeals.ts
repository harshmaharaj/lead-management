import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDeals, createDeal, updateDeal, deleteDeal, Deal } from '../services/api/deals'

export function useDeals() {
  const queryClient = useQueryClient()

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: getDeals
  })

  const createMutation = useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Deal> }) => 
      updateDeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    }
  })

  return {
    deals,
    isLoading,
    createDeal: createMutation.mutateAsync,
    updateDeal: updateMutation.mutateAsync,
    deleteDeal: deleteMutation.mutateAsync
  }
} 