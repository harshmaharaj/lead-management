import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useLeads } from '../../hooks/useLeads'

const dealSchema = z.object({
  lead_id: z.string().min(1, 'Lead is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  stage: z.enum(['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost']),
  probability: z.number().min(0).max(100),
  expected_close_date: z.string(),
  products: z.array(z.string()).optional(),
  lost_reason: z.string().optional(),
  won_date: z.string().optional()
})

type DealFormData = z.infer<typeof dealSchema>

interface DealFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: DealFormData) => Promise<void>
  initialData?: Partial<DealFormData>
}

export function DealForm({ open, onClose, onSubmit, initialData }: DealFormProps) {
  const { leads } = useLeads()
  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: initialData || {
      stage: 'discovery',
      probability: 0
    }
  })

  const stage = watch('stage')

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {initialData ? 'Edit Deal' : 'Add New Deal'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="lead_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Lead"
                    fullWidth
                    error={!!errors.lead_id}
                    helperText={errors.lead_id?.message}
                  >
                    {leads.map((lead) => (
                      <MenuItem key={lead.id} value={lead.id}>
                        {`${lead.first_name} ${lead.last_name} - ${lead.company}`}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Amount"
                    fullWidth
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="stage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Stage"
                    fullWidth
                    error={!!errors.stage}
                    helperText={errors.stage?.message}
                  >
                    <MenuItem value="discovery">Discovery</MenuItem>
                    <MenuItem value="proposal">Proposal</MenuItem>
                    <MenuItem value="negotiation">Negotiation</MenuItem>
                    <MenuItem value="closed_won">Closed Won</MenuItem>
                    <MenuItem value="closed_lost">Closed Lost</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="probability"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Probability (%)"
                    fullWidth
                    error={!!errors.probability}
                    helperText={errors.probability?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="expected_close_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Expected Close Date"
                    value={field.value}
                    onChange={(date) => field.onChange(date?.toISOString())}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.expected_close_date,
                        helperText: errors.expected_close_date?.message
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {stage === 'closed_lost' && (
              <Grid item xs={12}>
                <Controller
                  name="lost_reason"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Lost Reason"
                      fullWidth
                      multiline
                      rows={2}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
} 