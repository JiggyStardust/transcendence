import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<div className='bg-[#e6dfd3] dark:bg-[#343434] text-black dark:text-white'>
    	<App />
	</div>
  </StrictMode>,
)
