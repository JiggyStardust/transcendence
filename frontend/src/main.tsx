import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
		<div className='min-h-screen bg-gradient dark:bg-gradient-dark text-black dark:text-white'>
	    <App />
		</div>
  </StrictMode>,
)
