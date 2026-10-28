function getConcertName(concert) {
  if (typeof concert === 'string') return concert;
  return concert?.name || 'Concierto';
}

function TicketCard({ ticket }) {
  return (
    <article className="ticket-card">
      <div>
        <p className="ticket-card-label">ENTRADA</p>
        <h2>{getConcertName(ticket.concierto)}</h2>
        <p>{new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(ticket.fecha))}</p>
      </div>
      <div className="ticket-code-block">
        <span>Código de entrada</span>
        <strong>{ticket.code}</strong>
      </div>
      <p className={`ticket-status ${ticket.used ? 'used' : ''}`}>{ticket.used ? 'Utilizada' : 'Válida'}</p>
    </article>
  );
}

export default TicketCard;
