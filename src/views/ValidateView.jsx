import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validate } from '../services/validateService';
import './ValidateView.css';

function displayValue(value) {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value !== 'object') return String(value);
  return value.name || value.nombre || value.email || value.full_name || value.fullName || value.code || '—';
}

function ValidateView() {
  const [code, setCode] = useState('');
  const [request, setRequest] = useState({ status: 'idle' });

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return;
    setRequest({ status: 'loading' });
    try {
      const data = await validate(normalizedCode);
      setRequest({ status: 'valid', data });
      setCode('');
    } catch (error) {
      const status = error.response?.status;
      if (status === 409) setRequest({ status: 'used', message: error.response?.data?.message });
      else if (status === 404) setRequest({ status: 'missing', message: error.response?.data?.message });
      else if (status === 400) setRequest({ status: 'bad-request', message: error.response?.data?.message });
      else setRequest({ status: 'error', message: error.response?.data?.message });
    }
  }

  const ticket = request.data?.ticket || request.data || {};
  const owner = ticket.propietario ?? ticket.owner ?? ticket.user ?? ticket.customer;
  const concert = ticket.concierto ?? ticket.concert ?? ticket.event;
  const validatedAt = request.data?.validated_at ?? request.data?.validatedAt ?? request.data?.hora ?? ticket.validated_at ?? ticket.validatedAt ?? ticket.used_at ?? ticket.updated_at;

  return (
    <main className="validate-page">
      <Link to="/" className="back-link">← Volver a la cartelera</Link>
      <header className="validate-heading">
        <p className="purchase-kicker">CONTROL DE ACCESO</p>
        <h1>Validar entrada</h1>
        <p>Escaneá el código con un lector o ingresalo manualmente.</p>
      </header>

      <form className="validate-form" onSubmit={handleSubmit}>
        <label htmlFor="ticket-code">Código de entrada</label>
        <div className="validate-input-row">
          <input
            autoFocus
            autoComplete="off"
            id="ticket-code"
            name="code"
            placeholder="TKT-XXXXXX"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            aria-describedby="scanner-hint"
          />
          <button className="primary-button" type="submit" disabled={!code.trim() || request.status === 'loading'}>
            {request.status === 'loading' ? 'Validando…' : 'Validar'}
          </button>
        </div>
        <p id="scanner-hint" className="scanner-hint">El campo acepta lectores de código que escriben el código y confirman con Enter.</p>
      </form>

      {request.status === 'valid' && (
        <section className="validation-result validation-success" role="status" aria-live="polite">
          <p className="result-label">ENTRADA VALIDADA</p>
          <h2>Acceso autorizado</h2>
          <dl>
            <div><dt>Propietario</dt><dd>{displayValue(owner)}</dd></div>
            <div><dt>Concierto</dt><dd>{displayValue(concert)}</dd></div>
            <div><dt>Hora de validación</dt><dd>{displayValue(validatedAt)}</dd></div>
            <div><dt>Código</dt><dd>{displayValue(ticket.code ?? request.data?.code)}</dd></div>
          </dl>
        </section>
      )}
      {request.status === 'used' && <div className="validation-result validation-used" role="alert"><h2>Entrada ya utilizada</h2><p>{request.message || 'Este ticket ya fue validado anteriormente.'}</p></div>}
      {request.status === 'missing' && <div className="validation-result validation-error" role="alert"><h2>Entrada no encontrada</h2><p>{request.message || 'No existe una entrada con ese código.'}</p></div>}
      {request.status === 'bad-request' && <div className="validation-result validation-error" role="alert"><h2>Código inválido</h2><p>{request.message || 'Revisá el código e intentá nuevamente.'}</p></div>}
      {request.status === 'error' && <div className="validation-result validation-error" role="alert"><h2>No se pudo validar</h2><p>{request.message || 'Ocurrió un error al comunicarse con el servidor.'}</p></div>}
    </main>
  );
}

export default ValidateView;
