import {
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Fade
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  SwapHoriz as SwapHorizIcon,
  FileDownload as FileDownloadIcon,
  Close as CloseIcon
} from '@mui/icons-material'

interface BulkActionsToolbarProps {
  selectedCount: number
  onClose: () => void
  onDelete: () => void
  onSendEmail: () => void
  onChangeStatus: () => void
  onExport: () => void
}

export function BulkActionsToolbar({
  selectedCount,
  onClose,
  onDelete,
  onSendEmail,
  onChangeStatus,
  onExport
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <Fade in>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1300,
          bgcolor: 'grey.900',
          color: 'common.white'
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" color="inherit" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography variant="subtitle2">
              {selectedCount} selected
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'grey.700' }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Status">
              <Button
                size="small"
                color="inherit"
                startIcon={<SwapHorizIcon />}
                onClick={onChangeStatus}
              >
                Status
              </Button>
            </Tooltip>
            <Tooltip title="Send Email">
              <Button
                size="small"
                color="inherit"
                startIcon={<EmailIcon />}
                onClick={onSendEmail}
              >
                Email
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                size="small"
                color="inherit"
                startIcon={<DeleteIcon />}
                onClick={onDelete}
              >
                Delete
              </Button>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'grey.700' }} />
            <Tooltip title="Export">
              <IconButton size="small" color="inherit" onClick={onExport}>
                <FileDownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </Fade>
  )
} 