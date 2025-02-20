import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { statusService, type CreateStatusData } from '../services/api/statuses'
import { useSnackbar } from 'notistack'

export function useStatuses() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const { data: statuses, isLoading } = useQuery({
    queryKey: ['statuses'],
    queryFn: () => statusService.getAll(),
    onError: () => {
      enqueueSnackbar('Failed to load statuses', { variant: 'error' })
    }
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateStatusData) => statusService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
      enqueueSnackbar('Status created successfully', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Failed to create status', { variant: 'error' })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStatusData> }) => 
      statusService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
      enqueueSnackbar('Status updated successfully', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Failed to update status', { variant: 'error' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => statusService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
      enqueueSnackbar('Status deleted successfully', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Failed to delete status', { variant: 'error' })
    }
  })

  return {
    statuses,
    isLoading,
    createStatus: createMutation.mutate,
    updateStatus: updateMutation.mutate,
    deleteStatus: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
} 