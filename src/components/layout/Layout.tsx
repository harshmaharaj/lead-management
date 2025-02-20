import { Box } from '@mui/material'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Account for header height
          width: { sm: `calc(100% - 64px)` }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
} 