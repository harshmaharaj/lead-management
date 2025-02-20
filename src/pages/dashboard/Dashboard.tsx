import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material'
import {
  People as LeadsIcon,
  AttachMoney as DealsIcon,
  TrendingUp as ConversionIcon,
  Assessment as RevenueIcon
} from '@mui/icons-material'
import { getDashboardData, type DashboardMetrics } from '../../services/api/dashboard'

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  loading?: boolean
}

function MetricCard({ title, value, icon, loading = false }: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.light', mr: 2 }}>
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Typography variant="h4">{value}</Typography>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardMetrics | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData()
        setData(dashboardData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const metrics = [
    { 
      title: 'Total Leads', 
      value: data?.totalLeads ?? 0, 
      icon: <LeadsIcon color="primary" /> 
    },
    { 
      title: 'Active Deals', 
      value: data?.activeDeals ?? 0, 
      icon: <DealsIcon color="primary" /> 
    },
    { 
      title: 'Conversion Rate', 
      value: `${data?.conversionRate ?? 0}%`, 
      icon: <ConversionIcon color="primary" /> 
    },
    { 
      title: 'Revenue', 
      value: `$${(data?.totalRevenue ?? 0).toLocaleString()}`, 
      icon: <RevenueIcon color="primary" /> 
    }
  ]

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h2" sx={{ mb: 2, fontSize: '1.5rem' }}>
          Recent Leads
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : (
              data?.recentLeads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell align="right">${lead.value.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
} 