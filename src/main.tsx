import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerPwaUpdates } from './services/pwaUpdate';

// Mantém o app instalado no celular sempre na versão mais recente.
registerPwaUpdates();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
