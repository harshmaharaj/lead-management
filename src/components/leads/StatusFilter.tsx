import { Box, Chip } from '@mui/material'
import type { Lead } from '../../services/api/leads'

interface StatusFilterProps {
  value: Lead['status'] | 'all'
  onChange: (status: Lead['status'] | 'all') => void
  statusColors: Record<Lead['status'], 'default' | 'primary' | 'secondary' | 'success' | 'warning'>
}

export function StatusFilter({ value, onChange, statusColors }: StatusFilterProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Chip
        label="All"
        color={value === 'all' ? 'primary' : 'default'}
        onClick={() => onChange('all')}
        variant={value === 'all' ? 'filled' : 'outlined'}
      />
      {Object.entries(statusColors).map(([status]) => (
        <Chip
          key={status}
          label={status}
          color={value === status ? statusColors[status as Lead['status']] : 'default'}
          onClick={() => onChange(status as Lead['status'])}
          variant={value === status ? 'filled' : 'outlined'}
        />
      ))}
    </Box>
  )
} 