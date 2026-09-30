import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import EventCard from './EventCard';
import './EventList.css';

const featuredEvents = [
  {
    id: 'musica-bajo-las-estrellas',
    titulo: 'Música bajo las estrellas',
    artista: 'Artistas invitados',
    fecha: '2026-11-14',
    lugar: 'Teatro Griego · Mendoza',
    precio: 12000,
  },
  {
    id: 'noches-de-vinilo',
    titulo: 'Noches de vinilo',
    artista: 'DJ invitados',
    fecha: '2026-11-22',
    lugar: 'Nave Cultural · Mendoza',
    precio: 10000,
  },
  {
    id: 'entre-copas-y-canciones',
    titulo: 'Entre copas y canciones',
    artista: 'Artistas invitados',
    fecha: '2026-12-06',
    lugar: 'Arena Maipú · Mendoza',
    precio: 15000,
  },
  {
    id: 'festival-cordillera',
    titulo: 'Festival Cordillera',
    artista: 'Bandas en vivo',
    fecha: '2027-01-17',
    lugar: 'Parque San Martín · Mendoza',
    precio: 18000,
  },
  {
    id: 'tango-en-la-plaza',
    titulo: 'Tango en la plaza',
    artista: 'Orquesta Ciudad de Mendoza',
    fecha: '2027-02-05',
    lugar: 'Plaza Independencia · Mendoza',
    precio: 8500,
  },
  {
    id: 'rock-del-oeste',
    titulo: 'Rock del Oeste',
    artista: 'Las Voces del Sur',
    fecha: '2027-02-21',
    lugar: 'Auditorio Ángel Bustelo · Mendoza',
    precio: 14500,
  },
  {
    id: 'sinfónica-al-atardecer',
    titulo: 'Sinfónica al atardecer',
    artista: 'Orquesta Filarmónica',
    fecha: '2027-03-12',
    lugar: 'Teatro Independencia · Mendoza',
    precio: 11000,
  },
  {
    id: 'electro-andes',
    titulo: 'Electro Andes',
    artista: 'Nébula y artistas invitados',
    fecha: '2027-03-27',
    lugar: 'Nave Cultural · Mendoza',
    precio: 13500,
  },
];

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        // apiClient ya tiene el prefijo /api configurado en su base URL.
        const response = await apiClient.get('/eventos');
        const data = response.data;
        const eventList = Array.isArray(data) ? data : data?.eventos || data?.events || data?.data || [];
        if (active) setEvents(Array.isArray(eventList) ? eventList : []);
      } catch {
        if (active) {
          setEvents(featuredEvents);
          setError('No pudimos cargar los eventos del backend. Mostramos eventos destacados mientras se restablece la conexión.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadEvents();
    return () => { active = false; };
  }, []);

  if (loading) return <p className="event-list-message" role="status">Cargando eventos…</p>;
  if (!events.length) return <p className="event-list-message">No hay conciertos disponibles en este momento.</p>;

  return (
    <>
      {error && <p className="event-list-message event-list-error" role="alert">{error}</p>}
      <div className="event-list-grid">
        {events.map((event, index) => <EventCard key={event.id || event._id || index} event={event} />)}
      </div>
    </>
  );
}

export default EventList;
