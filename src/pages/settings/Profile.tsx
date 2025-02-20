import { useState } from 'react'
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  Grid,
  IconButton,
  CircularProgress
} from '@mui/material'
import { PhotoCamera } from '@mui/icons-material'
import { useProfile } from '../../hooks/useProfile'
import { Loading } from '../../components/common/Loading'
import { getAvatarUrl } from '../../utils/avatar'

export function ProfileSettings() {
  const { profile, isLoading, updateProfile, uploadAvatar } = useProfile()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  if (isLoading || !profile) {
    return <Loading />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      setError(null)
      setSuccess(false)
      
      await updateProfile({
        full_name: formData.get('fullName') as string,
        phone: formData.get('phone') as string
      })
      
      setSuccess(true)
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setError(null)
      setUploading(true)
      await uploadAvatar(file)
      setSuccess(true)
    } catch (err) {
      setError('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Profile Settings
      </Typography>

      <Card sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profile updated successfully
          </Alert>
        )}

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar
            src={getAvatarUrl(profile.avatar_url)}
            sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            type="file"
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload">
            <IconButton
              color="primary"
              component="span"
              aria-label="upload picture"
              disabled={uploading}
            >
              {uploading ? (
                <CircularProgress size={24} />
              ) : (
                <PhotoCamera />
              )}
            </IconButton>
          </label>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={profile.email}
                disabled
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="fullName"
                label="Full Name"
                defaultValue={profile.full_name}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="phone"
                label="Phone"
                defaultValue={profile.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="role"
                label="Role"
                value={profile.role}
                disabled
              />
            </Grid>

            {profile.team && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="team"
                  label="Team"
                  value={profile.team.name}
                  disabled
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  )
} 