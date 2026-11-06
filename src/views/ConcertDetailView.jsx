import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EventPurchase from '../components/EventPurchase';
import { useSession } from '../hooks/useSession';
import { getConcert } from '../services/concertService';
import Spinner from '../components/Spinner';
import './ConcertDetailView.css';

function getConcertRequestState({ request, loading, concert }) {
  if (loading) return <main className="purchase-page"><Spinner label="Cargando concierto…" /></main>;
  if (request.notFound) return <main className="purchase-page"><h1>Concierto no encontrado</h1><Link to="/">Volver a la cartelera</Link></main>;
  if (request.error || !concert) return <main className="purchase-page"><p role="alert">No pudimos cargar el concierto. Intentá nuevamente más tarde.</p><Link to="/">Volver a la cartelera</Link></main>;
  return null;
}

function ConcertHeading({ concert }) {
  return <>
    {concert.image_url && <img className="concert-detail-image" src={concert.image_url} alt={concert.name} />}
    <header className="purchase-header">
      <p className="purchase-kicker">DETALLE DEL CONCIERTO</p>
      <h1>{concert.name}</h1>
      <p>{new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(concert.date))}</p>
      <p>{concert.description}</p>
    </header>
  </>;
}

function ConcertDetailView() {
  const { id } = useParams();
  const { user } = useSession();
  const [request, setRequest] = useState({ id: null, loading: true });

  useEffect(() => {
    let active = true;
    getConcert(id)
      .then((data) => { if (active) setRequest({ id, concert: data, loading: false }); })
      .catch((requestError) => {
        if (!active) return;
        const notFound = requestError.response?.status === 404;
        setRequest({ id, notFound, error: !notFound, loading: false });
      });
    return () => { active = false; };
  }, [id]);

  const loading = request.id !== id || request.loading;
  const concert = request.id === id ? request.concert : null;
  const requestState = getConcertRequestState({ request, loading, concert });
  if (requestState) return requestState;

  return (
    <>
      <main className="purchase-page concert-detail-page">
        <Link to="/" className="back-link">← Volver a la cartelera</Link>
        <ConcertHeading concert={concert} />
      </main>
      <EventPurchase event={concert} id={id} user={user} />
    </>
  );
}

export default ConcertDetailView;
