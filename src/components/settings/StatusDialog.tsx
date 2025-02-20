import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton
} from '@mui/material'
import { ChromePicker } from 'react-color'
import { Circle as CircleIcon } from '@mui/icons-material'

interface StatusDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { label: string; color: string }) => void
  initialData?: { label: string; color: string }
}

export function StatusDialog({ open, onClose, onSubmit, initialData }: StatusDialogProps) {
  const [label, setLabel] = useState(initialData?.label || '')
  const [color, setColor] = useState(initialData?.color || '#4CAF50')
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ label, color })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Status' : 'Add New Status'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              label="Status Name"
              fullWidth
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Status Color
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => setShowColorPicker(!showColorPicker)}
                sx={{ 
                  bgcolor: color,
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: color }
                }}
              >
                <CircleIcon sx={{ color: 'white' }} />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                Click to change color
              </Typography>
            </Box>
            {showColorPicker && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <ChromePicker
                  color={color}
                  onChange={(newColor) => setColor(newColor.hex)}
                  disableAlpha
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
} 