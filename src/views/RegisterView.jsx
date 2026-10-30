import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../services/httpError';
import { register } from '../services/authService';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
import './auth.css';

function RegisterView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      await register(email.trim(), password);
      navigate('/login', { replace: true, state: { registered: true, email: email.trim(), from: location.state?.from } });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudo crear la cuenta. Revisá los datos e intentá otra vez.'));
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-title">
        <p className="purchase-kicker">CREÁ TU CUENTA</p>
        <h1 id="register-title">Registrate</h1>
        <p>Usá tu email para guardar tus entradas y compras.</p>
        <form onSubmit={handleSubmit}>
          <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Contraseña<input required type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <Toast type="error">{error}</Toast>}
          <button className="checkout-button" type="submit" disabled={pending}>{pending ? 'Creando cuenta…' : 'Crear cuenta'}</button>
          {pending && <Spinner label="Creando cuenta…" />}
        </form>
        <p className="auth-switch">¿Ya tenés cuenta? <Link to="/login" state={location.state}>Iniciar sesión</Link></p>
        <Link className="auth-back" to="/">Volver a eventos</Link>
      </section>
    </main>
  );
}

export default RegisterView;
