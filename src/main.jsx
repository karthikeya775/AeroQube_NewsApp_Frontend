import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { SearchProvider } from './contexts/SearchContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SearchProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
    </SearchProvider>
  </React.StrictMode>,
)
