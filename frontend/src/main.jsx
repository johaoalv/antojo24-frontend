import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './modules/common/styles/index.css'
import './modules/common/styles/login.css'
import './modules/pos/styles/print-ticket.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
