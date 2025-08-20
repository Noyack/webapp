// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom' // Fixed import from react-router-dom
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { UserProvider } from './Provider/UserProvider'
import { ResponsiveProvider } from './context/ResponsiveContext'
import SearchProvider from './components/Search/SearchContext'
import { PlaidProvider } from './Provider/PlaidProvider'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error("Failed to find the root element")
}

const root = createRoot(rootElement)

root.render(
  // <StrictMode>
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY} 
    afterSignOutUrl="/" 
    touchSession={false}
  >
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <UserProvider>
          <PlaidProvider>
            <SearchProvider>
              <ResponsiveProvider>
                <App />
              </ResponsiveProvider>
            </SearchProvider>
          </PlaidProvider>
        </UserProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  </ClerkProvider>
  // </StrictMode>,
)