import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EventPurchase from '../components/EventPurchase';
import { useSession } from '../hooks/useSession';
import { getConcert } from '../services/concertService';
import Spinner from '../components/Spinner';
import './ConcertDetailView.css';

function getRequestState(id, data) {
  return { id, concert: data, loading: false };
}

function getRequestErrorState(id, error) {
  const notFound = error.response?.status === 404;
  return { id, notFound, error: !notFound, loading: false };
}

function isRequestLoading(request, id) {
  return request.id !== id || request.loading;
}

function getCurrentConcert(request, id) {
  if (request.id !== id) return null;
  return request.concert;
}

function hasRequestError(request, concert) {
  return Boolean(request.error || !concert);
}

function getRequestNotice(request, id) {
  const loading = isRequestLoading(request, id);
  const concert = getCurrentConcert(request, id);
  const hasError = hasRequestError(request, concert);
  if (loading) return <main className="purchase-page"><Spinner label="Cargando concierto…" /></main>;
  if (request.notFound) return <main className="purchase-page"><h1>Concierto no encontrado</h1><Link to="/">Volver a la cartelera</Link></main>;
  if (hasError) return <main className="purchase-page"><p role="alert">No pudimos cargar el concierto. Intentá nuevamente más tarde.</p><Link to="/">Volver a la cartelera</Link></main>;
  return null;
}

function ConcertContent({ concert }) {
  return (
    <main className="purchase-page concert-detail-page">
      <Link to="/" className="back-link">&#8592; Volver a la cartelera</Link>
      {concert.image_url && <img className="concert-detail-image" src={concert.image_url} alt={concert.name} />}
      <header className="purchase-header">
        <p className="purchase-kicker">DETALLE DEL CONCIERTO</p>
        <h1>{concert.name}</h1>
        <p>{new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(concert.date))}</p>
        <p>{concert.description}</p>
      </header>
    </main>
  );
}
function ConcertDetailView() {
  const { id } = useParams();
  const { user } = useSession();
  const [request, setRequest] = useState({ id: null, loading: true });

  useEffect(() => {
    let active = true;
    getConcert(id)
      .then((data) => { if (active) setRequest(getRequestState(id, data)); })
      .catch((requestError) => {
        if (!active) return;
        setRequest(getRequestErrorState(id, requestError));
      });
    return () => { active = false; };
  }, [id]);

  const notice = getRequestNotice(request, id);
  if (notice) return notice;
  const concert = request.id === id ? request.concert : null;

  return (
    <>
      <ConcertContent concert={concert} />
      <EventPurchase event={concert} id={id} user={user} />
    </>
  );
}

export default ConcertDetailView;
