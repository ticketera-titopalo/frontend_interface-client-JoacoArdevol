import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import { getMyTickets, getPurchaseTickets } from '../services/ticketService';
import './MyTicketsView.css';
import Spinner from '../components/Spinner';

const getRequestKey = (purchaseId) => purchaseId || 'all';
const getTickets = (request, key) => request.key === key ? request.tickets || [] : [];

function TicketCollection({ purchaseId, loading, forbidden, tickets }) {
  if (loading) return <Spinner label="Cargando entradas…" />;
  if (forbidden) return <p role="alert">No tenés permiso para ver las entradas de esta compra.</p>;
  if (!tickets.length) return <p>No encontramos entradas{purchaseId ? ' para esta compra' : ''}.</p>;
  return <div className="my-tickets-list">{tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)}</div>;
}

function MyTicketsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const purchaseId = searchParams.get('purchase_id');
  const [request, setRequest] = useState({ key: null, loading: true });

  useEffect(() => {
    let active = true;
    const key = getRequestKey(purchaseId);
    const loadTickets = purchaseId ? getPurchaseTickets(purchaseId) : getMyTickets();
    loadTickets
      .then((tickets) => { if (active) setRequest({ key, tickets, loading: false }); })
      .catch((error) => {
        if (!active) return;
        setRequest({ key, forbidden: error.response?.status === 403, loading: false });
      });
    return () => { active = false; };
  }, [purchaseId]);

  const key = getRequestKey(purchaseId);
  const loading = request.key !== key || request.loading;
  const tickets = getTickets(request, key);

  return (
    <main className="my-tickets-page">
      <Link to="/" className="back-link">← Volver a la cartelera</Link>
      <header className="my-tickets-heading">
        <p className="purchase-kicker">TUS EXPERIENCIAS</p>
        <h1>Mis Entradas</h1>
        {purchaseId && <p>Entradas de la compra #{purchaseId}</p>}
      </header>
      {purchaseId && <button className="ticket-filter-clear" type="button" onClick={() => setSearchParams({})}>Ver todas mis entradas</button>}
      <TicketCollection purchaseId={purchaseId} loading={loading} forbidden={request.forbidden} tickets={tickets} />
    </main>
  );
}

export default MyTicketsView;
