import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { getApiStatus } from '../services/events';
import { getConcerts } from '../services/concertService';
import ConcertCard from '../components/ConcertCard';

function HomeView() {
  const [status, setStatus] = useState('checking');
  const [statusData, setStatusData] = useState(null);
  const [concerts, setConcerts] = useState([]);
  const [concertsLoading, setConcertsLoading] = useState(true);
  const [concertsError, setConcertsError] = useState(false);
  const { user, logout } = useSession();

  useEffect(() => {
    let active = true;
    getApiStatus()
      .then((data) => { if (active) { setStatusData(data); setStatus('ok'); } })
      .catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    getConcerts()
      .then((data) => { if (active) setConcerts(data); })
      .catch(() => { if (active) setConcertsError(true); })
      .finally(() => { if (active) setConcertsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="app-shell">
      <nav className="navbar" aria-label="Navegación principal">
        <Link className="brand" to="/" aria-label="Entrada, inicio"><span className="brand-mark">E</span><span>entrada<span className="brand-dot">.</span></span></Link>
        <div className="nav-links"><a href="#eventos">Eventos</a><a href="#experiencias">Experiencias</a><a href="#ayuda">Ayuda</a>{user && <Link to="/mis-entradas">Mis Entradas</Link>}{user && <Link to="/billetera/pagar">Pagar con QR</Link>}{user && <Link to="/billetera/cobrar">Cobrar</Link>}</div>
        {user
          ? <button className="account-button" type="button" onClick={logout}>Cerrar sesión <span>↗</span></button>
          : <Link className="account-button" to="/login">Mi cuenta <span>↗</span></Link>}
      </nav>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse" /> LA PRÓXIMA HISTORIA EMPIEZA ACÁ</p>
          <h1>Viví lo que<br /><em>no se repite.</em></h1>
          <p className="hero-description">Las mejores experiencias en vivo, curadas para vos. Encontrá tu próxima noche inolvidable.</p>
          <div className="hero-actions"><a className="primary-button" href="#eventos">Explorar eventos <span>→</span></a><button className="play-button" type="button" onClick={() => window.alert('Entrada te ayuda a descubrir y comprar experiencias en vivo.')}><span>▶</span> Conocé Entrada</button></div>
          {user && <div className="hero-actions"><Link className="text-link" to="/billetera/pagar">Pagar con QR</Link><Link className="text-link" to="/billetera/cobrar">Cobrar con QR</Link></div>}
        </div>
        <div className="hero-art" aria-hidden="true"><div className="orb orb-one" /><div className="orb orb-two" /><div className="concert-card"><div className="card-glow" /><p>LIVE<br />MUSIC</p><span>2026</span></div><div className="ticket ticket-top"><span>ENTRADA</span><b>01</b></div><div className="ticket ticket-bottom"><span>CONCIERTO</span><b>LIVE</b></div></div>
      </section>

      <section className="events-section" id="eventos">
        <div className="section-heading"><div><p className="eyebrow">SELECCIÓN DE LA SEMANA</p><h2>Conciertos para vivir muy pronto.</h2></div><a href="#eventos" className="text-link">Ver todos los eventos <span>→</span></a></div>
        {concertsLoading && <p className="event-list-message" role="status">Cargando conciertos…</p>}
        {!concertsLoading && concertsError && <p className="event-list-message event-list-error" role="alert">No pudimos cargar los conciertos. Intentá nuevamente más tarde.</p>}
        {!concertsLoading && !concertsError && concerts.length === 0 && <p className="event-list-message">No hay conciertos disponibles en este momento.</p>}
        {!concertsLoading && !concertsError && concerts.length > 0 && <div className="event-list-grid">{concerts.map((concert) => <ConcertCard key={concert.id} concert={concert} />)}</div>}
      </section>

      <section className="trust-strip" id="experiencias"><p>Más que una entrada, una experiencia completa.</p><div><span>✓ Compra segura</span><span>✦ Beneficios exclusivos</span><span>◎ Soporte cuando lo necesitás</span></div></section>
      <footer id="ayuda"><span>© 2026 entrada.</span><span className={`connection ${status}`}><i />{status === 'checking' && 'Conectando…'}{status === 'ok' && (statusData?.message || 'Servicio disponible')}{status === 'error' && 'Servicio sin conexión'}</span></footer>
    </main>
  );
}

export default HomeView;
