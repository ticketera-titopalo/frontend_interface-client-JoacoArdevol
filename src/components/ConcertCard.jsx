import { Link } from 'react-router-dom';
import './ConcertCard.css';

function ConcertCard({ concert }) {
  const date = concert.date
    ? new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(concert.date))
    : 'Fecha a confirmar';
  const price = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(concert.price) || 0);

  return (
    <Link to={`/eventos/${concert.id}`} className="event-card" aria-label={`Ver detalle de ${concert.name}`}>
      <div className="event-card-media">
        {concert.image_url
          ? <img src={concert.image_url} alt={concert.name} className="event-card-image" />
          : <div className="event-card-placeholder" aria-label="Concierto sin imagen">♪</div>}
      </div>
      <div className="event-card-info">
        <p className="event-card-date">{date}</p>
        <h3 className="event-card-title">{concert.name}</h3>
        <p className="event-card-description">{concert.description}</p>
        <p className="event-card-price">{price}</p>
      </div>
    </Link>
  );
}

export default ConcertCard;
