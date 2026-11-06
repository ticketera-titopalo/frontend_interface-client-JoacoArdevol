import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import { getMyTickets, getPurchaseTickets } from '../services/ticketService';
import './MyTicketsView.css';
import Spinner from '../components/Spinner';

function PurchaseFilter({ purchaseId, onClear }) {
  if (!purchaseId) return null;
  return <button className="ticket-filter-clear" type="button" onClick={onClear}>Ver todas mis entradas</button>;
}

function TicketsHeading({ purchaseId }) {
  return <header className="my-tickets-heading">
    <p className="purchase-kicker">TUS EXPERIENCIAS</p>
    <h1>Mis Entradas</h1>
    {purchaseId && <p>Entradas de la compra #{purchaseId}</p>}
  </header>;
}

function TicketsContent({ loading, forbidden, tickets, purchaseId }) {
  if (loading) return <Spinner label="Cargando entradas…" />;
  if (forbidden) return <p role="alert">No tenés permiso para ver las entradas de esta compra.</p>;
  if (tickets.length === 0) return <p>No encontramos entradas{purchaseId ? ' para esta compra' : ''}.</p>;
  return <div className="my-tickets-list">{tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)}</div>;
}

function MyTicketsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const purchaseId = searchParams.get('purchase_id');
  const [request, setRequest] = useState({ key: null, loading: true });

  useEffect(() => {
    let active = true;
    const key = purchaseId || 'all';
    const loadTickets = purchaseId ? getPurchaseTickets(purchaseId) : getMyTickets();
    loadTickets
      .then((tickets) => { if (active) setRequest({ key, tickets, loading: false }); })
      .catch((error) => {
        if (!active) return;
        setRequest({ key, forbidden: error.response?.status === 403, loading: false });
      });
    return () => { active = false; };
  }, [purchaseId]);

  const loading = request.key !== (purchaseId || 'all') || request.loading;
  const tickets = request.key === (purchaseId || 'all') ? request.tickets || [] : [];

  return (
    <main className="my-tickets-page">
      <Link to="/" className="back-link">← Volver a la cartelera</Link>
      <TicketsHeading purchaseId={purchaseId} />
      <PurchaseFilter purchaseId={purchaseId} onClear={() => setSearchParams({})} />
      <TicketsContent loading={loading} forbidden={request.forbidden} tickets={tickets} purchaseId={purchaseId} />
    </main>
  );
}

export default MyTicketsView;
