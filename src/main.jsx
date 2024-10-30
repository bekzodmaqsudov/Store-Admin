import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './assets/style/main.css'

createRoot(document.querySelector('.wrapper')).render(
  <BrowserRouter>
    <App /> 
  </BrowserRouter>
)
