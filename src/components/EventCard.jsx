import { useState } from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

const getImageUrl = (event) => {
  const image = firstDefined(event.imagen, event.image, event.imageUrl, event.imagenUrl);
  return typeof image === 'object' ? firstDefined(image?.url, image?.src) : image;
};

const getArtist = (event) => {
  const artist = firstDefined(event.artista, event.artist, event.artists);
  if (Array.isArray(artist)) return artist.map((item) => item?.nombre || item?.name || item).join(', ');
  return artist?.nombre || artist?.name || artist;
};

const getLowestPrice = (event) => {
  const sectors = firstDefined(event.sectores, event.sectors, event.entradas, event.tickets, []);
  const prices = Array.isArray(sectors)
    ? sectors
      .filter((sector) => sector?.disponible !== false && sector?.available !== false && sector?.stock !== 0)
      .map((sector) => Number(firstDefined(sector?.precio, sector?.price)))
      .filter(Number.isFinite)
    : [];

  const directPrice = Number(firstDefined(event.precio, event.price, event.precioDesde));
  if (Number.isFinite(directPrice)) prices.push(directPrice);
  return prices.length ? Math.min(...prices) : null;
};

const formatDate = (value) => {
  if (!value) return 'Fecha a confirmar';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
};

function EventCard({ event }) {
  const [imageFailed, setImageFailed] = useState(false);
  const id = firstDefined(event.id, event._id, event.eventoId);
  const title = firstDefined(event.titulo, event.title, event.nombre, event.name, 'Evento sin título');
  const artist = getArtist(event);
  const venue = firstDefined(event.lugar, event.venue, event.ubicacion, event.place, event.sede, 'Lugar a confirmar');
  const date = firstDefined(event.fecha, event.date, event.fechaEvento, event.fecha_inicio);
  const imageUrl = getImageUrl(event);
  const lowestPrice = getLowestPrice(event);

  return (
    <Link to={`/eventos/${id}`} state={{ event }} className="event-card" aria-label={`Ver detalle de ${title}`}>
      <div className="event-card-media">
        {imageUrl && !imageFailed ? (
          <img src={imageUrl} alt={title} className="event-card-image" onError={() => setImageFailed(true)} />
        ) : (
          <div className="event-card-placeholder" aria-label="Evento sin imagen">♪</div>
        )}
      </div>
      <div className="event-card-info">
        <p className="event-card-date">{formatDate(date)}</p>
        <h3 className="event-card-title">{title}</h3>
        <p className="event-card-artist">{artist || 'Artista a confirmar'}</p>
        <p className="event-card-location">{venue}</p>
        <p className="event-card-price">
          {lowestPrice === null
            ? 'Precio a confirmar'
            : `Desde ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: event.moneda || 'ARS', maximumFractionDigits: 0 }).format(lowestPrice)}`}
        </p>
      </div>
    </Link>
  );
}

export default EventCard;
