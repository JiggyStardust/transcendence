import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<div className='bg-gradient dark:bg-gradient-dark text-black dark:text-white'>
    <AuthProvider>
			<App />
		</AuthProvider>	
	</div>
  </StrictMode>,
)
