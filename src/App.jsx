import { useState, useEffect } from 'react';
import apiClient from './api/client';
import './App.css';

function App() {
  const [status, setStatus] = useState('checking');
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    apiClient
      .get('/status')
      .then((response) => {
        setStatusData(response.data);
        setStatus('ok');
      })
      .catch((error) => {
        console.error('Error conectando con el backend:', error);
        setStatus('error');
      });
  }, []);

  return (
    <div className="App">
      <h1>Ticketera de Conciertos</h1>
      <div className="status-box">
        {status === 'checking' && <p>Verificando conexión con el backend...</p>}
        {status === 'ok' && (
          <p style={{ color: 'green' }}>
            ✅ Conexión exitosa con el backend Flask.
            {statusData?.message && <span> — {statusData.message}</span>}
          </p>
        )}
        {status === 'error' && (
          <p style={{ color: 'red' }}>
            ❌ No se pudo conectar con el backend. Verificá que Flask esté corriendo en {import.meta.env.VITE_API_URL}.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;