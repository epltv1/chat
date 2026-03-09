import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import App from './App'
import './index.css'

export const supabase = createClient(
  'https://jvpnulbwrjjryrqbzfpa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cG51bGJ3cmpqcnlycWJ6ZnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzU4MTEsImV4cCI6MjA4ODQxMTgxMX0.BDrz2DTfybunOlU0nuSNvURu8-ePgEK_pfrXIrxa7Ss' 
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
