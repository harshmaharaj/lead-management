import { Box, CircularProgress } from '@mui/material'

export function Loading() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}
    >
      <CircularProgress />
    </Box>
  )
} 