import React from 'react'
import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton as MuiIconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  styled,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
  Checkbox,
  Toolbar,
  alpha,
  IconButton,
} from '@mui/material'
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Sort as SortIcon
} from '@mui/icons-material'
import { useLeads } from '../../hooks/useLeads'
import { LeadDialog } from '../../components/leads/LeadDialog'
import type { Lead } from '../../services/api/leads'
import { StatusFilter } from '../../components/leads/StatusFilter'
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog'
import { BulkActionsToolbar } from '../../components/leads/BulkActionsToolbar'

// Status chip colors
const statusColors: Record<Lead['status'], 'default' | 'primary' | 'secondary' | 'success' | 'warning'> = {
  'New': 'default',
  'Contacted': 'primary',
  'Qualified': 'secondary',
  'Proposal': 'warning',
  'Negotiation': 'success'
}

// Styled components
const StyledIconButton = styled(MuiIconButton)`
  margin-left: 8px;
`

export function LeadsPage() {
  const { leads, isLoading, createLead, updateLead, deleteLead } = useLeads()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selected, setSelected] = useState<string[]>([])
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  const handleCreate = () => {
    setSelectedLead(null)
    setDialogMode('create')
    setDialogOpen(true)
  }

  const handleEdit = (lead: Lead) => {
    setSelectedLead({
      ...lead,
      assignedTo: lead.assignedTo || null
    })
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(id)
      } catch (error) {
        console.error('Failed to delete lead:', error)
      }
    }
  }

  const handleSubmit = async (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (dialogMode === 'create') {
        await createLead(data)
        setConfirmDialog({
          open: true,
          title: 'Success',
          message: 'Lead created successfully!',
          onConfirm: () => {
            setConfirmDialog(prev => ({ ...prev, open: false }))
            setDialogOpen(false)
          }
        })
      } else if (selectedLead) {
        setConfirmDialog({
          open: true,
          title: 'Confirm Update',
          message: 'Are you sure you want to update this lead?',
          onConfirm: async () => {
            await updateLead({
              id: selectedLead.id,
              data: {
                name: data.name,
                company: data.company,
                email: data.email,
                phone: data.phone,
                status: data.status,
                value: data.value,
                assignedTo: data.assignedTo
              }
            })
            setConfirmDialog(prev => ({ ...prev, open: false }))
            setDialogOpen(false)
          }
        })
      }
    } catch (error) {
      console.error('Failed to save lead:', error)
      throw error
    }
  }

  // Filter leads by search term and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Get paginated leads
  const paginatedLeads = filteredLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedLeads.map((lead) => lead.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleSelect = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selected.length} leads?`)) {
      try {
        await Promise.all(selected.map(id => deleteLead(id)))
        setSelected([])
      } catch (error) {
        console.error('Failed to delete leads:', error)
      }
    }
  }

  // Placeholder functions for bulk actions
  const handleBulkEmail = () => {
    console.log('Send email to:', selected)
  }

  const handleBulkStatusChange = () => {
    console.log('Change status for:', selected)
  }

  const handleBulkExport = () => {
    console.log('Export details for:', selected)
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h1">
            Leads
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Add Lead
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search leads..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <StatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
            statusColors={statusColors}
          />
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < paginatedLeads.length}
                  checked={paginatedLeads.length > 0 && selected.length === paginatedLeads.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  hover
                  selected={selected.includes(lead.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(lead.id)}
                      onChange={() => handleSelect(lead.id)}
                    />
                  </TableCell>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={lead.status} 
                      color={statusColors[lead.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    ${lead.value.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(lead.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <MuiIconButton size="small" color="primary" onClick={() => handleEdit(lead)}>
                        <EditIcon />
                      </MuiIconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <MuiIconButton size="small" color="error" onClick={() => handleDelete(lead.id)}>
                        <DeleteIcon />
                      </MuiIconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLeads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <LeadDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedLead || undefined}
        mode={dialogMode}
      />

      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      />

      <BulkActionsToolbar
        selectedCount={selected.length}
        onClose={() => setSelected([])}
        onDelete={handleBulkDelete}
        onSendEmail={handleBulkEmail}
        onChangeStatus={handleBulkStatusChange}
        onExport={handleBulkExport}
      />
    </Box>
  )
} 