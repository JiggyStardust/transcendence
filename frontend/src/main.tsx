import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
		<div className='bg-light-bg dark:bg-dark-bg text-black dark:text-white min-h-screen accent-vintage-red dark:accent-vintage-yellow'>
	    <AuthProvider>
				<ToastProvider>
					<App />
				</ToastProvider>
			</AuthProvider>	
		</div>
  </StrictMode>
)
