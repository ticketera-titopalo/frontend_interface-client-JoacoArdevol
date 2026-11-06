import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { getConcerts } from '../services/concertService';
import ConcertCard from '../components/ConcertCard';
import Spinner from '../components/Spinner';

function AccountLinks({ user, isAdmin }) {
  const links = [
    { to: '/mis-entradas', label: 'Mis Entradas', visible: Boolean(user) },
    { to: '/perfil', label: 'Mi perfil', visible: Boolean(user) },
    { to: '/tickets/consulta', label: 'Consultar ticket', visible: Boolean(user) },
    { to: '/admin/validar', label: 'Validar entradas', visible: isAdmin() },
  ].filter((link) => link.visible);

  return <>{links.map(({ to, label }) => <Link key={to} to={to}>{label}</Link>)}</>;
}

function AccountAction({ user, logout, navigate }) {
  if (!user) return <Link className="account-button" to="/login">Mi cuenta <span>↗</span></Link>;
  return <button className="account-button" type="button" onClick={() => { void logout(); navigate('/login', { replace: true }); }}>Cerrar sesión <span>↗</span></button>;
}

function EventsContent({ loading, error, concerts }) {
  if (loading) return <Spinner label="Cargando conciertos…" />;
  if (error) return <p className="event-list-message event-list-error" role="alert">No pudimos cargar los conciertos. Intentá nuevamente más tarde.</p>;
  if (concerts.length === 0) return <p className="event-list-message">No hay conciertos disponibles en este momento.</p>;
  return <div className="event-list-grid">{concerts.map((concert) => <ConcertCard key={concert.id} concert={concert} />)}</div>;
}

function HomeView() {
  const [concerts, setConcerts] = useState([]);
  const [concertsLoading, setConcertsLoading] = useState(true);
  const [concertsError, setConcertsError] = useState(false);
  const { user, logout, isAdmin } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getConcerts()
      .then((data) => { if (active) setConcerts(data.concerts); })
      .catch(() => { if (active) setConcertsError(true); })
      .finally(() => { if (active) setConcertsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="app-shell">
      <nav className="navbar" aria-label="Navegación principal">
        <Link className="brand" to="/" aria-label="Entrada, inicio"><span className="brand-mark">E</span><span>entrada<span className="brand-dot">.</span></span></Link>
        <div className="nav-links"><a href="#eventos">Eventos</a><a href="#experiencias">Experiencias</a><a href="#ayuda">Ayuda</a><AccountLinks user={user} isAdmin={isAdmin} /></div>
        <AccountAction user={user} logout={logout} navigate={navigate} />
      </nav>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse" /> LA PRÓXIMA HISTORIA EMPIEZA ACÁ</p>
          <h1>Viví lo que<br /><em>no se repite.</em></h1>
          <p className="hero-description">Las mejores experiencias en vivo, curadas para vos. Encontrá tu próxima noche inolvidable.</p>
          <div className="hero-actions"><a className="primary-button" href="#eventos">Explorar eventos <span>→</span></a><a className="play-button" href="#experiencias"><span>▶</span> Conocé Entrada</a></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="orb orb-one" /><div className="orb orb-two" /><div className="concert-card"><div className="card-glow" /><p>LIVE<br />MUSIC</p><span>2026</span></div><div className="ticket ticket-top"><span>ENTRADA</span><b>01</b></div><div className="ticket ticket-bottom"><span>CONCIERTO</span><b>LIVE</b></div></div>
      </section>

      <section className="events-section" id="eventos" aria-label="Eventos disponibles">
        <div className="section-heading"><div><p className="eyebrow">SELECCIÓN DE LA SEMANA</p><h2>Conciertos para vivir muy pronto.</h2></div><a href="#eventos" className="text-link">Ver todos los eventos <span>→</span></a></div>
        <EventsContent loading={concertsLoading} error={concertsError} concerts={concerts} />
      </section>

      <section className="trust-strip" id="experiencias"><p>Más que una entrada: una experiencia completa.</p><div><span>✓ Compra segura</span><span>✦ Beneficios exclusivos</span><span>◎ Soporte cuando lo necesitás</span></div></section>
      <footer id="ayuda"><span>© 2026 entrada.</span><span>Entradas seguras para experiencias en vivo</span></footer>
    </main>
  );
}

export default HomeView;
