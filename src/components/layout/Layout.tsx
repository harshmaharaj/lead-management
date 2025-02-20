import { Box } from '@mui/material'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          marginLeft: 0,
          width: `calc(100% - ${64}px)`,
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
          overflowX: 'hidden'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
} 