export function getAvatarUrl(url?: string | null) {
  if (!url) return undefined
  
  // If it's already a full URL, return it
  if (url.startsWith('http')) return url
  
  // Otherwise, construct the full URL using Supabase storage
  const { VITE_SUPABASE_URL } = import.meta.env
  return `${VITE_SUPABASE_URL}/storage/v1/object/public/${url}`
} 