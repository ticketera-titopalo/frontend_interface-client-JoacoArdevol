import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import EventCard from './EventCard';
import featuredEvents from '../data/featuredEvents';
import './EventList.css';

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
