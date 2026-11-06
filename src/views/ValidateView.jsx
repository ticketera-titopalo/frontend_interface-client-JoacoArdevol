import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validate } from '../services/validateService';
import Spinner from '../components/Spinner';

function ValidateView() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const ticket = await validate(code.trim().toUpperCase());
      setResult({ type: 'valid', ticket });
      setCode('');
    } catch (error) {
      const status = error.response?.status;
      setResult({ type: status === 409 ? 'used' : status === 404 ? 'missing' : 'error', message: error.response?.data?.message });
    } finally {
      setLoading(false);
    }
  }

  const data = result?.ticket || {};
  const owner = data.propietario || data.owner || data.user;
  const concert = data.concierto || data.concert || data.event;
  const time = data.validated_at || data.validatedAt || data.hora;
  const value = (item) => typeof item === 'object' && item ? item.name || item.nombre || item.email : item;

  return (
    <main style={{ maxWidth: 640, margin: '50px auto', padding: '0 20px' }}>
      <Link to="/">← Volver a eventos</Link>
      <h1>Validar entrada</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="ticket-code">Código de ticket</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input id="ticket-code" autoFocus value={code} onChange={(event) => setCode(event.target.value)} placeholder="TKT-XXXXXX" style={{ flex: 1, padding: 12 }} />
          <button type="submit" disabled={loading || !code.trim()}>{loading ? 'Validando…' : 'Validar'}</button>
        </div>
        <small>También podés usar un lector de códigos conectado al equipo.</small>
      </form>
      {loading && <Spinner label="Validando entrada…" />}
      {result?.type === 'valid' && <p role="status">✅ Validada — {value(owner) || 'Propietario sin datos'} · {value(concert) || 'Concierto sin datos'} · {time || 'Hora no disponible'}</p>}
      {result?.type === 'used' && <p role="alert">Esta entrada ya fue utilizada. {result.message}</p>}
      {result?.type === 'missing' && <p role="alert">No existe una entrada con ese código. {result.message}</p>}
      {result?.type === 'error' && <p role="alert">No se pudo validar la entrada. {result.message}</p>}
    </main>
  );
}

export default ValidateView;
