import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert
} from '@mui/material'
import type { Lead } from '../../services/api/leads'
import { leadSchema, type LeadFormData } from '../../schemas/lead'

interface LeadFormData {
  status: Lead['status']
  name: string
  value: number
  company: string
  email: string
  assignedTo: string | null
  phone?: string | null  // Make phone nullable
}

interface LeadDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: LeadFormData) => Promise<void>
  initialData?: Partial<LeadFormData>
  mode: 'create' | 'edit'
}

const STATUSES: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation']

export function LeadDialog({ open, onClose, onSubmit, initialData, mode }: LeadDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData?.name || '',
      company: initialData?.company || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      status: initialData?.status || 'New',
      value: initialData?.value || 0,
      assignedTo: initialData?.assignedTo || null
    }
  })

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || '',
        company: initialData?.company || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        status: initialData?.status || 'New',
        value: initialData?.value || 0,
        assignedTo: initialData?.assignedTo || null
      })
    }
  }, [initialData, open, reset])

  const onSubmitForm = async (data: LeadFormData) => {
    setLoading(true)
    setError(null)
    try {
      await onSubmit(data)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle>{mode === 'create' ? 'Add New Lead' : 'Edit Lead'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Company"
                fullWidth
                required
                error={!!errors.company}
                helperText={errors.company?.message}
                {...register('company')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
                {...register('phone')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                fullWidth
                required
                error={!!errors.status}
                helperText={errors.status?.message}
                {...register('status')}
              >
                {STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Value"
                type="number"
                fullWidth
                required
                error={!!errors.value}
                helperText={errors.value?.message}
                {...register('value', { valueAsNumber: true })}
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
} 