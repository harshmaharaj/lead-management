import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, updateUserProfile, uploadAvatar } from '../services/api/users'
import { useAuth } from '../context/AuthContext'

export function useProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getUserProfile(user!.id),
    enabled: !!user
  })

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateUserProfile>[1]) => 
      updateUserProfile(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
    }
  })

  const avatarMutation = useMutation({
    mutationFn: (file: File) => uploadAvatar(user!.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
    }
  })

  return {
    profile,
    isLoading,
    updateProfile: updateMutation.mutateAsync,
    uploadAvatar: avatarMutation.mutateAsync
  }
} 