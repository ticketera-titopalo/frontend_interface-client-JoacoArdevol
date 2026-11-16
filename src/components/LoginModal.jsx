import { useState } from 'react';
import './LoginModal.css';

function CredentialsForm({ email, setEmail, onSubmit }) {
  return <>
    <p className="purchase-kicker">MI CUENTA</p>
    <h2 id="login-title">Iniciá sesión para comprar</h2>
    <p>Tu sesión es necesaria para reservar asientos y recibir las entradas.</p>
    <form onSubmit={onSubmit}>
      <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="vos@email.com" /></label>
      <label>Contraseña<input required minLength="6" type="password" autoComplete="current-password" placeholder="Mínimo 6 caracteres" /></label>
      <button className="checkout-button" type="submit">Enviar código de verificación</button>
    </form>
    <small>Demo local: no se guardan contraseñas ni se envían correos reales.</small>
  </>;
}

function VerificationForm({ email, code, error, setCode, onSubmit, onBack }) {
  return <>
    <p className="purchase-kicker">VERIFICÁ TU CORREO</p>
    <h2 id="login-title">Ingresá el código</h2>
    <p>Enviamos un código de verificación a <strong>{email}</strong>.</p>
    <p className="simulation-code">Simulación: tu código es <strong>{code}</strong></p>
    <form onSubmit={onSubmit}>
      <label>Código de seis dígitos<input required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" pattern="[0-9]{6}" placeholder="000000" autoFocus /></label>
      {error && <p className="payment-error" role="alert">{error}</p>}
      <button className="checkout-button" type="submit">Verificar correo e ingresar</button>
      <button className="secondary-login-button" type="button" onClick={onBack}>Usar otro email</button>
    </form>
    <small>En producción, este código llegará al correo indicado. Por ahora se muestra solo para probar el flujo.</small>
  </>;
}

function LoginModalBody({ credentials, formProps }) {
  if (credentials) return <CredentialsForm {...formProps.credentials} />;
  return <VerificationForm {...formProps.verification} />;
}

function sendVerificationCode(event, setters) {
  event.preventDefault();
  setters.setVerificationCode(String(Math.floor(100000 + Math.random() * 900000)));
  setters.setEnteredCode('');
  setters.setCodeError('');
  setters.setStep('verification');
}

function verifyLoginCode(event, data) {
  event.preventDefault();
  if (data.enteredCode !== data.verificationCode) {
    data.setCodeError('El c\u00f3digo no coincide. Revisalo e intent\u00e1 otra vez.');
    return;
  }
  data.onLogin({ email: data.email, name: data.email.split('@')[0] });
  data.setEmail('');
  data.setVerificationCode('');
  data.setStep('credentials');
}

function LoginModal({ open, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [step, setStep] = useState('credentials');
  const [codeError, setCodeError] = useState('');
  if (!open) return null;

  const setters = { setVerificationCode, setEnteredCode, setCodeError, setStep };
  const sendCode = (event) => sendVerificationCode(event, setters);
  const verifyCode = (event) => verifyLoginCode(event, { ...setters, enteredCode, verificationCode, email, onLogin, setEmail });

  const formProps = {
    credentials: { email, setEmail, onSubmit: sendCode },
    verification: { email, code: verificationCode, error: codeError, setCode: setEnteredCode, onSubmit: verifyCode, onBack: () => setStep('credentials') },
  };
  return <div className="login-overlay" role="presentation">
    <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <button className="login-close" type="button" onClick={onClose} aria-label="Cerrar">&times;</button>
      <LoginModalBody credentials={step === 'credentials'} formProps={formProps} />
    </section>
  </div>;
}

export default LoginModal;
