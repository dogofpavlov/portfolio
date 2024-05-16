import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss';
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <ThemeProvider>
      <App />
    </ThemeProvider>
  ,
)
