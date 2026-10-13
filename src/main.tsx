import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Sin StrictMode: <Html> de drei crea un root de React por pin y el doble montaje
// de StrictMode desmonta ese root durante el render.
createRoot(document.getElementById('root')!).render(<App />)
