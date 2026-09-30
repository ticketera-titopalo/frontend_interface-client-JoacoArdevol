import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import apiClient from './api/client';
import './App.css';
import EventList from './components/EventList';
import EventPurchase from './components/EventPurchase';
import LoginModal from './components/LoginModal';

function EventoDetalle({ id, event, user, onRequestLogin }) {
  return <EventPurchase id={id} event={event} user={user} onRequestLogin={onRequestLogin} />;
}

function AppContent({ user, onRequestLogin, onLogout }) {
  const [status, setStatus] = useState('checking');
  const [statusData, setStatusData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    apiClient.get('/status')
      .then((response) => { setStatusData(response.data); setStatus('ok'); })
      .catch(() => setStatus('error'));
  }, []);

  const detailMatch = location.pathname.match(/^\/eventos\/([^/]+)$/);
  if (detailMatch) return <EventoDetalle id={detailMatch[1]} event={location.state?.event} user={user} onRequestLogin={onRequestLogin} />;

  return (
    <main className="app-shell">
        <nav className="navbar" aria-label="Navegación principal">
          <a className="brand" href="#inicio" aria-label="Entrada, inicio"><span className="brand-mark">E</span><span>entrada<span className="brand-dot">.</span></span></a>
          <div className="nav-links">
            <a href="#eventos">Eventos</a>
            <a href="#experiencias">Experiencias</a>
            <a href="#ayuda">Ayuda</a>
          </div>
          <button className="account-button" type="button" onClick={user ? onLogout : onRequestLogin}>{user ? 'Cerrar sesión' : 'Mi cuenta'} <span>↗</span></button>
        </nav>

        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow"><span className="pulse" /> LA PRÓXIMA HISTORIA EMPIEZA ACÁ</p>
            <h1>Viví lo que<br /><em>no se repite.</em></h1>
            <p className="hero-description">Las mejores experiencias en vivo, curadas para vos. Encontrá tu próxima noche inolvidable.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#eventos">Explorar eventos <span>→</span></a>
              <button className="play-button" type="button" onClick={() => window.alert('Entrada te ayuda a descubrir y comprar experiencias en vivo.') }><span>▶</span> Conocé Entrada</button>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="concert-card">
              <div className="card-glow" />
              <p>LIVE<br />MUSIC</p>
              <span>2026</span>
            </div>
            <div className="ticket ticket-top">
              <span>ENTRADA</span>
              <b>01</b>
            </div>
            <div className="ticket ticket-bottom">
              <span>CONCIERTO</span>
              <b>LIVE</b>
            </div>
          </div>
        </section>

        <section className="events-section" id="eventos">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SELECCIÓN DE LA SEMANA</p>
              <h2>Para vivir muy pronto.</h2>
            </div>
            <a href="#ver-todos" className="text-link">Ver todos los eventos <span>→</span></a>
          </div>
          <EventList />
        </section>

        <section className="trust-strip" id="experiencias">
          <p>Más que una entrada, una experiencia completa.</p>
          <div>
            <span>✓ Compra segura</span>
            <span>✦ Beneficios exclusivos</span>
            <span>◎ Soporte cuando lo necesitás</span>
          </div>
        </section>
        <footer id="ayuda">
          <span>© 2026 entrada.</span>
          <span className={`connection ${status}`}>
            <i />
            {status === 'checking' && 'Conectando…'}
            {status === 'ok' && (statusData?.message || 'Servicio disponible')}
            {status === 'error' && 'Servicio sin conexión'}
          </span>
        </footer>

    </main>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem('entrada-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginOpen, setLoginOpen] = useState(false);
  const login = (nextUser) => {
    window.localStorage.setItem('entrada-user', JSON.stringify(nextUser));
    setUser(nextUser);
    setLoginOpen(false);
  };
  const logout = () => {
    window.localStorage.removeItem('entrada-user');
    setUser(null);
  };

  return (
    <Router>
      <AppContent user={user} onRequestLogin={() => setLoginOpen(true)} onLogout={logout} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={login} />
    </Router>
  );
}

export default App;
