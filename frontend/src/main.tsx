import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { ToastProvider } from './context/ToastContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
		<div className='bg-light-bg dark:bg-dark-bg text-stone-900 dark:text-stone-200 min-h-screen accent-vintage-red dark:accent-vintage-yellow selection:bg-vintage-yellow/70 dark:selection:bg-vintage-red/30'>
	    <AuthProvider>
				<UserProvider>
					<ToastProvider>
						<App />
					</ToastProvider>
				</UserProvider>
			</AuthProvider>	
		</div>
  </StrictMode>
)
