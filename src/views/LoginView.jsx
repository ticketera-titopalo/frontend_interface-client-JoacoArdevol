import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { getErrorMessage } from '../services/httpError';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
import './auth.css';

function LoginView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const { signIn } = useSession();
  const redirectTo = location.state?.from || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      await signIn(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudo iniciar sesión. Revisá tu email y contraseña.'));
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="purchase-kicker">MI CUENTA</p>
        <h1 id="login-title">Iniciá sesión</h1>
        <p>Ingresá para continuar con tu compra y tus entradas.</p>
        {location.state?.registered && <p className="auth-success" role="status">Cuenta creada. Ya podés iniciar sesión.</p>}
        <form onSubmit={handleSubmit}>
          <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Contraseña<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <Toast type="error">{error}</Toast>}
          <button className="checkout-button" type="submit" disabled={pending}>{pending ? 'Ingresando…' : 'Iniciar sesión'}</button>
          {pending && <Spinner label="Ingresando…" />}
        </form>
        <p className="auth-switch">¿No tenés cuenta? <Link to="/register" state={location.state}>Crear cuenta</Link></p>
        <Link className="auth-back" to="/">Volver a eventos</Link>
      </section>
    </main>
  );
}

export default LoginView;
