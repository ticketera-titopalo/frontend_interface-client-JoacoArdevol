import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { getErrorMessage } from '../services/httpError';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
import './auth.css';

function RegisteredNotice({ registered }) {
  if (!registered) return null;
  return <p className="auth-success" role="status">Cuenta creada. Ya podés iniciar sesión.</p>;
}

function LoginError({ error }) {
  return error ? <Toast type="error">{error}</Toast> : null;
}

function LoginProgress({ pending }) {
  return pending ? <Spinner label="Ingresando…" /> : null;
}

function createLoginSubmit(dependencies) {
  const { email, password, signIn, navigate, redirectTo, setError, setPending } = dependencies;
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
  return handleSubmit;
}

function LoginForm({ state, email, setEmail, password, setPassword, error, pending, onSubmit }) {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="purchase-kicker">MI CUENTA</p>
        <h1 id="login-title">Iniciá sesión</h1>
        <p>Ingresá para continuar con tu compra y tus entradas.</p>
        <RegisteredNotice registered={state?.registered} />
        <form onSubmit={onSubmit}>
          <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Contraseña<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <LoginError error={error} />
          <button className="checkout-button" type="submit" disabled={pending}>{pending ? 'Ingresando…' : 'Iniciar sesión'}</button>
          <LoginProgress pending={pending} />
        </form>
        <p className="auth-switch">¿No tenés cuenta? <Link to="/register" state={state}>Crear cuenta</Link></p>
        <Link className="auth-back" to="/">Volver a eventos</Link>
      </section>
    </main>
  );
}

function LoginView() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state || {};
  const [email, setEmail] = useState(locationState.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const { signIn } = useSession();
  const redirectTo = locationState.from || '/';

  const handleSubmit = createLoginSubmit({ email, password, signIn, navigate, redirectTo, setError, setPending });

  return (
    <LoginForm state={locationState} email={email} setEmail={setEmail} password={password} setPassword={setPassword} error={error} pending={pending} onSubmit={handleSubmit} />
  );
}

export default LoginView;
