import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('Environment variables:', {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  HAS_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
) 