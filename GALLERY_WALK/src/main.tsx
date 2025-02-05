import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './styling/index.css'
import App from './App.tsx'
import { CurrentUserProvider } from './contexts/currentUser-context-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <CurrentUserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CurrentUserProvider>,
)
