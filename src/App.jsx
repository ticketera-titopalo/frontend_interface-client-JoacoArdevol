import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './App.css';
import RequireAuth from './components/RequireAuth';
import { SessionProvider } from './hooks/SessionContext';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import HomeView from './views/HomeView';
import ConcertDetailView from './views/ConcertDetailView';
import MyTicketsView from './views/MyTicketsView';
import ValidateView from './views/ValidateView';
import PurchaseView from './views/PurchaseView';
import ProfileView from './views/ProfileView';
import AdminConcertsView from './views/AdminConcertsView';

const PayWithQrView = lazy(() => import('./views/PayWithQrView'));
const ReceiveQrView = lazy(() => import('./views/ReceiveQrView'));

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/eventos/:id" element={<ConcertDetailView />} />
      <Route path="/eventos/:id/compra" element={<RequireAuth><PurchaseView /></RequireAuth>} />
      <Route path="/perfil" element={<RequireAuth><ProfileView /></RequireAuth>} />
      <Route path="/mis-entradas" element={<RequireAuth><MyTicketsView /></RequireAuth>} />
      <Route path="/billetera/pagar" element={<RequireAuth><Suspense fallback={<p role="status">Cargando billetera…</p>}><PayWithQrView /></Suspense></RequireAuth>} />
      <Route path="/billetera/cobrar" element={<RequireAuth><Suspense fallback={<p role="status">Cargando billetera…</p>}><ReceiveQrView /></Suspense></RequireAuth>} />
      <Route path="/admin" element={<RequireAuth admin><Navigate to="/admin/validar" replace /></RequireAuth>} />
      <Route path="/admin/validar" element={<RequireAuth admin><ValidateView /></RequireAuth>} />
      <Route path="/admin/conciertos" element={<RequireAuth admin><AdminConcertsView /></RequireAuth>} />
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
