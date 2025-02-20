import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from './Header'
import { AuthProvider } from '../../context/AuthContext'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'

describe('Header', () => {
  it('renders the app title', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    )
    
    expect(screen.getByText('Lead Management')).toBeInTheDocument()
  })
}) 