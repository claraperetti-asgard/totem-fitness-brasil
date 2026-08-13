import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'

// Bloqueia o zoom por pinça e por toque duplo (Safari/iOS ignora o meta viewport).
for (const evento of ['gesturestart', 'gesturechange', 'gestureend']) {
  document.addEventListener(evento, (e) => e.preventDefault())
}

document.addEventListener(
  'touchmove',
  (e) => {
    if (e.touches.length > 1) e.preventDefault()
  },
  { passive: false }
)

let ultimoToque = 0

document.addEventListener(
  'touchend',
  (e) => {
    const agora = e.timeStamp

    if (agora - ultimoToque < 300) e.preventDefault()

    ultimoToque = agora
  },
  { passive: false }
)

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)