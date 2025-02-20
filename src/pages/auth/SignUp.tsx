import { useState } from 'react'
import { 
  Box, 
  Card, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Container,
  Link
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { Link as RouterLink } from 'react-router-dom'

export function SignUpPage() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await signUp(email, password)
      setSuccess(true)
    } catch (err) {
      setError('Failed to create account.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Card sx={{ p: 4, width: '100%' }}>
            <Typography variant="h5" align="center" gutterBottom>
              Check your email
            </Typography>
            <Typography align="center" color="text.secondary">
              We've sent you an email with a link to confirm your account.
            </Typography>
          </Card>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Card sx={{ p: 4, width: '100%' }}>
          <Typography variant="h1" align="center" gutterBottom>
            Sign Up
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login">
              Already have an account? Sign in
            </Link>
          </Box>
        </Card>
      </Box>
    </Container>
  )
} 