import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import './App.css';
import RequireAuth from './components/RequireAuth';
import EventList from './components/EventList';
import featuredEvents from './data/featuredEvents';
import EventPurchase from './components/EventPurchase';
import { SessionProvider } from './hooks/SessionContext';
import { useSession } from './hooks/useSession';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import { getApiStatus } from './services/events';

function HomeView() {
  const [status, setStatus] = useState('checking');
  const [statusData, setStatusData] = useState(null);
  const { user, logout } = useSession();

  useEffect(() => {
    let active = true;
    getApiStatus()
      .then((data) => {
        if (active) { setStatusData(data); setStatus('ok'); }
      })
      .catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, []);

  return (
    <main className="app-shell">
      <nav className="navbar" aria-label="Navegación principal">
        <Link className="brand" to="/" aria-label="Entrada, inicio"><span className="brand-mark">E</span><span>entrada<span className="brand-dot">.</span></span></Link>
        <div className="nav-links">
          <a href="#eventos">Eventos</a>
          <a href="#experiencias">Experiencias</a>
          <a href="#ayuda">Ayuda</a>
        </div>
        {user
          ? <button className="account-button" type="button" onClick={logout}>Cerrar sesión <span>↗</span></button>
          : <Link className="account-button" to="/login">Mi cuenta <span>↗</span></Link>}
      </nav>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse" /> LA PRÓXIMA HISTORIA EMPIEZA ACÁ</p>
          <h1>Viví lo que<br /><em>no se repite.</em></h1>
          <p className="hero-description">Las mejores experiencias en vivo, curadas para vos. Encontrá tu próxima noche inolvidable.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#eventos">Explorar eventos <span>→</span></a>
            <button className="play-button" type="button" onClick={() => window.alert('Entrada te ayuda a descubrir y comprar experiencias en vivo.')}><span>▶</span> Conocé Entrada</button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="concert-card"><div className="card-glow" /><p>LIVE<br />MUSIC</p><span>2026</span></div>
          <div className="ticket ticket-top"><span>ENTRADA</span><b>01</b></div>
          <div className="ticket ticket-bottom"><span>CONCIERTO</span><b>LIVE</b></div>
        </div>
      </section>

      <section className="events-section" id="eventos">
        <div className="section-heading">
          <div><p className="eyebrow">SELECCIÓN DE LA SEMANA</p><h2>Para vivir muy pronto.</h2></div>
          <a href="#eventos" className="text-link">Ver todos los eventos <span>→</span></a>
        </div>
        <EventList />
      </section>

      <section className="trust-strip" id="experiencias">
        <p>Más que una entrada, una experiencia completa.</p>
        <div><span>✓ Compra segura</span><span>✦ Beneficios exclusivos</span><span>◎ Soporte cuando lo necesitás</span></div>
      </section>
      <footer id="ayuda">
        <span>© 2026 entrada.</span>
        <span className={`connection ${status}`}><i />
          {status === 'checking' && 'Conectando…'}
          {status === 'ok' && (statusData?.message || 'Servicio disponible')}
          {status === 'error' && 'Servicio sin conexión'}
        </span>
      </footer>
    </main>
  );
}

function EventDetailView() {
  const location = useLocation();
  const { id } = useParams();
  const [event, setEvent] = useState(location.state?.event || null);
  const { user } = useSession();
  useEffect(() => {
    if (event) return undefined;
    let active = true;
    import('./services/apiClient').then(({ default: apiClient }) => apiClient.get(`/eventos/${id}`))
      .then((response) => {
        if (active) setEvent(response.data?.evento || response.data?.event || response.data?.data || response.data);
      })
      .catch(() => {
        if (active) setEvent(featuredEvents.find((item) => String(item.id) === id) || null);
      });
    return () => { active = false; };
  }, [event, id]);
  return <EventPurchase id={id} event={event} user={user} />;
}

function AdminView() {
  return <main className="auth-page"><section className="auth-card"><p className="purchase-kicker">ADMINISTRACIÓN</p><h1>Panel de administración</h1><p>Acceso autorizado para administradores.</p><Link className="auth-back" to="/">Volver a eventos</Link></section></main>;
}

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/eventos/:id" element={<EventDetailView />} />
      <Route path="/admin/*" element={<RequireAuth admin><AdminView /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" state={{ from: location }} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRoutes />
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;
