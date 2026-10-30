import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EventPurchase from '../components/EventPurchase';
import { useSession } from '../hooks/useSession';
import { getConcert } from '../services/concertService';

function PurchaseView() {
  const { id } = useParams();
  const { user } = useSession();
  const [concert, setConcert] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getConcert(id).then((data) => { if (active) setConcert(data); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [id]);

  if (error) return <main className="purchase-page"><p role="alert">No pudimos cargar el concierto.</p><Link to="/">Volver</Link></main>;
  if (!concert) return <main className="purchase-page"><p role="status">Cargando concierto…</p></main>;
  return <EventPurchase event={concert} id={id} user={user} />;
}

export default PurchaseView;
