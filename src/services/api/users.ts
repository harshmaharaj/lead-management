import { supabase } from '../supabase/client'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  role: 'admin' | 'sales_manager' | 'sales_rep'
  team_id?: string
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      team:teams(id, name)
    `)
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as UserProfile & { team: { id: string; name: string } | null }
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('users')
    .update(profile)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as UserProfile
}

export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('user-content')
    .upload(filePath, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('user-content')
    .getPublicUrl(filePath)

  await updateUserProfile(userId, { avatar_url: publicUrl })
  return publicUrl
} 