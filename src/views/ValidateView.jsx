import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validate } from '../services/validateService';
import Spinner from '../components/Spinner';

function getValidationErrorType(status) {
  return ({ 409: 'used', 404: 'missing' })[status] || 'error';
}

function getValidationFailure(error) {
  const response = error.response;
  const status = response?.status;
  return { type: getValidationErrorType(status), message: response?.data?.message };
}

const errorMessages = {
  used: 'Esta entrada ya fue utilizada.',
  missing: 'No existe una entrada con ese código.',
  error: 'No se pudo validar la entrada.',
};

function firstValue(...values) {
  return values.find(Boolean);
}

function getDisplayValue(item) {
  if (!item || typeof item !== 'object') return item;
  return firstValue(item.name, item.nombre, item.email);
}

function ValidTicketResult({ ticket }) {
  const owner = firstValue(ticket.propietario, ticket.owner, ticket.user);
  const concert = firstValue(ticket.concierto, ticket.concert, ticket.event);
  const time = firstValue(ticket.validated_at, ticket.validatedAt, ticket.hora);
  return <p role="status">✅ Validada — {getDisplayValue(owner) || 'Propietario sin datos'} · {getDisplayValue(concert) || 'Concierto sin datos'} · {time || 'Hora no disponible'}</p>;
}

function ValidationResult({ result }) {
  if (!result) return null;
  if (result.type === 'valid') return <ValidTicketResult ticket={result.ticket || {}} />;
  const message = errorMessages[result.type];
  return message ? <p role="alert">{message} {result.message}</p> : null;
}

function ValidationForm({ code, setCode, loading, onSubmit }) {
  return (
      <form onSubmit={onSubmit}>
        <label htmlFor="ticket-code">Código de ticket</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input id="ticket-code" autoFocus value={code} onChange={(event) => setCode(event.target.value)} placeholder="TKT-XXXXXX" style={{ flex: 1, padding: 12 }} />
          <button type="submit" disabled={loading || !code.trim()}>{loading ? 'Validando…' : 'Validar'}</button>
        </div>
        <small>También podés usar un lector de códigos conectado al equipo.</small>
      </form>
  );
}

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
      setResult(getValidationFailure(error));
    } finally {
      setLoading(false);
    }
  }


  return (
    <main style={{ maxWidth: 640, margin: '50px auto', padding: '0 20px' }}>
      <Link to="/">← Volver a eventos</Link>
      <h1>Validar entrada</h1>
      <ValidationForm code={code} setCode={setCode} loading={loading} onSubmit={handleSubmit} />
      {loading && <Spinner label="Validando entrada…" />}
      <ValidationResult result={result} />
    </main>
  );
}

export default ValidateView;
