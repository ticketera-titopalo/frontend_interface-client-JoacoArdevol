import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConcerts } from '../services/concertService';

function AdminConcertsView() {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getConcerts().then((items) => { if (active) setConcerts(items); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <main className="my-tickets-page">
    <Link to="/admin/validar">← Administración</Link>
    <h1>Administrar conciertos</h1>
    {loading && <p role="status">Cargando conciertos…</p>}
    {error && <p role="alert">No pudimos cargar los conciertos.</p>}
    {!loading && !error && !concerts.length && <p>No hay conciertos disponibles.</p>}
    <ul>{concerts.map((concert) => <li key={concert.id}>{concert.name} · Stock: {concert.stock}</li>)}</ul>
  </main>;
}

export default AdminConcertsView;
