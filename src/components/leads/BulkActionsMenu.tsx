import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  SwapHoriz as SwapHorizIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material'
import { useState } from 'react'

interface BulkActionsMenuProps {
  selectedCount: number
  onDelete: () => void
  onSendEmail: () => void
  onChangeStatus: () => void
  onExport: () => void
}

export function BulkActionsMenu({ selectedCount, onDelete, onSendEmail, onChangeStatus, onExport }: BulkActionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAction = (action: () => void) => {
    handleClose()
    action()
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        disabled={selectedCount === 0}
        color={selectedCount > 0 ? 'primary' : 'default'}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleAction(onDelete)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Selected</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction(onSendEmail)}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction(onChangeStatus)}>
          <ListItemIcon>
            <SwapHorizIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Status</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction(onExport)}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Details</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
} 