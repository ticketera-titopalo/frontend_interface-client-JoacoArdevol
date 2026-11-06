import { useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { getByCode } from '../services/ticketService';

function lookupErrorMessage(error) {
  if (error.response?.status === 404) return 'No existe una entrada con ese código.';
  return 'No pudimos consultar la entrada.';
}

function LookupResult({ loading, error, ticket }) {
  if (loading) return <Spinner label="Buscando entrada…" />;
  if (error) return <p role="alert">{error}</p>;
  if (!ticket) return null;
  return <article className="ticket-card"><h2>{ticket.concert_name}</h2><p>{new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(ticket.date))}</p><p>{ticket.user_name}</p><p>{ticket.used ? 'Utilizada' : 'No utilizada'}</p></article>;
}

function TicketLookupView() {
  const [code, setCode] = useState('');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function lookup(event) {
    event.preventDefault();
    if (!code.trim()) return;
    setLoading(true); setError(''); setTicket(null);
    try { setTicket(await getByCode(code.trim().toUpperCase())); }
    catch (requestError) { setError(lookupErrorMessage(requestError)); }
    finally { setLoading(false); }
  }

  return <main className="my-tickets-page">
    <Link to="/">← Volver a eventos</Link><h1>Consultar entrada</h1>
    <form onSubmit={lookup}><label htmlFor="lookup-code">Código de ticket</label><input id="lookup-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="TKT-XXXXXX" required /><button disabled={loading}>{loading ? 'Buscando…' : 'Consultar'}</button></form>
    <LookupResult loading={loading} error={error} ticket={ticket} />
  </main>;
}

export default TicketLookupView;
