import React, { useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardHeader,
  Avatar,
  Chip,
  Paper,
  Toolbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Storage as StorageIcon,
  DataObject as DatabaseIcon,
  Cloud as CloudIcon,
  Memory as MemoryIcon,
  Settings as SettingsIcon,
  Circle as CircleIcon,
  Add as AddIcon
} from '@mui/icons-material'
import { StatusDialog } from '../../components/settings/StatusDialog'
import { useStatuses } from '../../hooks/useStatuses'

const settingCards = [
  {
    id: 'status',
    title: 'Status Configuration',
    description: 'Manage lead status types and colors',
    icon: <CircleIcon sx={{ color: '#4CAF50' }} />,
    action: 'Configure',
    preview: [
      { color: '#4CAF50', label: 'Active' },
      { color: '#FFC107', label: 'Pending' },
      { color: '#F44336', label: 'Lost' },
      { color: '#2196F3', label: 'Won' }
    ]
  },
  {
    id: 'database',
    title: 'Supabase',
    description: 'Postgres backend',
    icon: <StorageIcon sx={{ color: '#3ECF8E' }} />,
    action: 'Create'
  },
  {
    id: 'redis',
    title: 'Redis',
    description: 'Serverless Redis',
    icon: <DatabaseIcon sx={{ color: '#DC382D' }} />,
    status: 'Beta',
    action: 'Create'
  },
  {
    id: 'edge',
    title: 'Edge Config',
    description: 'Ultra-low latency reads',
    icon: <CloudIcon sx={{ color: '#666' }} />,
    action: 'Create'
  },
  {
    id: 'cache',
    title: 'EdgeDB',
    description: 'Fast high-level database',
    icon: <MemoryIcon sx={{ color: '#4A36C6' }} />,
    action: 'Create'
  }
]

interface Status {
  id: string
  label: string
  color: string
}

export function Settings() {
  const { 
    statuses, 
    isLoading, 
    createStatus, 
    updateStatus, 
    deleteStatus,
    isCreating,
    isUpdating,
    isDeleting 
  } = useStatuses()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<Status | undefined>()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [statusToDelete, setStatusToDelete] = useState<string | null>(null)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  const handleAddStatus = (data: { label: string; color: string }) => {
    createStatus({
      status_name: data.label,
      status_color: data.color
    })
    setDialogOpen(false)
  }

  const handleEditStatus = (data: { label: string; color: string }) => {
    if (selectedStatus) {
      updateStatus({
        id: selectedStatus.id,
        data: {
          status_name: data.label,
          status_color: data.color
        }
      })
    }
    setDialogOpen(false)
  }

  const handleDeleteClick = (id: string) => {
    setStatusToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (statusToDelete) {
      deleteStatus(statusToDelete)
      setDeleteConfirmOpen(false)
      setStatusToDelete(null)
    }
  }

  return (
    <Box>
      {/* Header Toolbar */}
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 }
        }}
      >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          component="div"
          color="primary"
        >
          Settings
        </Typography>
      </Toolbar>

      {/* Main Content */}
      <Box sx={{ p: 2 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 }
            }}
          >
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              component="div"
            >
              Database Providers
            </Typography>
          </Toolbar>

          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {settingCards.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.id}>
                  <Card 
                    elevation={1}
                    sx={{ 
                      height: '100%',
                      '&:hover': { 
                        boxShadow: 3,
                        borderColor: 'primary.main',
                        borderWidth: 1,
                        borderStyle: 'solid'
                      }
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar 
                          variant="rounded"
                          sx={{ 
                            bgcolor: 'background.default',
                            width: 40,
                            height: 40
                          }}
                        >
                          {card.icon}
                        </Avatar>
                      }
                      title={
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {card.title}
                        </Typography>
                      }
                      subheader={card.description}
                    />
                    <CardContent>
                      {card.id === 'status' && (
                        <Box sx={{ mb: 2 }}>
                          {statuses?.map((status) => (
                            <Chip
                              key={status.id}
                              size="small"
                              label={status.status_name}
                              onClick={() => {
                                setSelectedStatus({
                                  id: status.id,
                                  label: status.status_name,
                                  color: status.status_color
                                })
                                setDialogOpen(true)
                              }}
                              onDelete={() => handleDeleteClick(status.id)}
                              sx={{
                                m: 0.5,
                                bgcolor: status.status_color,
                                color: 'white',
                                '& .MuiChip-label': {
                                  fontSize: '0.75rem'
                                }
                              }}
                            />
                          ))}
                          <Chip
                            size="small"
                            icon={<AddIcon />}
                            label="Add Status"
                            variant="outlined"
                            onClick={() => {
                              setSelectedStatus(undefined)
                              setDialogOpen(true)
                            }}
                            sx={{ m: 0.5 }}
                          />
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="outlined"
                          size="small"
                          color="primary"
                        >
                          {card.action}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Box>

      <StatusDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setSelectedStatus(undefined)
        }}
        onSubmit={(data) => {
          if (selectedStatus) {
            handleEditStatus(data)
          } else {
            handleAddStatus(data)
          }
        }}
        initialData={selectedStatus}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Status</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this status? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
} 