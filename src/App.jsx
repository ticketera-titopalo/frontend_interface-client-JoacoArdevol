import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import RequireAuth from './components/RequireAuth';
import { SessionProvider } from './hooks/SessionContext';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import HomeView from './views/HomeView';
import ConcertDetailView from './views/ConcertDetailView';
import MyTicketsView from './views/MyTicketsView';

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
      <Route path="/eventos/:id" element={<ConcertDetailView />} />
      <Route path="/mis-entradas" element={<RequireAuth><MyTicketsView /></RequireAuth>} />
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
