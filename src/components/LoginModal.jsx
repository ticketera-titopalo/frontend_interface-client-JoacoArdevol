import { useState } from 'react';
import './LoginModal.css';

function LoginModal({ open, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [step, setStep] = useState('credentials');
  const [codeError, setCodeError] = useState('');

  if (!open) return null;

  const sendVerificationCode = (event) => {
    event.preventDefault();
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    setVerificationCode(newCode);
    setEnteredCode('');
    setCodeError('');
    setStep('verification');
  };

  const verifyCode = (event) => {
    event.preventDefault();
    if (enteredCode !== verificationCode) {
      setCodeError('El código no coincide. Revisalo e intentá otra vez.');
      return;
    }
    onLogin({ email, name: email.split('@')[0] });
    setEmail('');
    setVerificationCode('');
    setStep('credentials');
  };

  return (
    <div className="login-overlay" role="presentation">
      <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <button className="login-close" type="button" onClick={onClose} aria-label="Cerrar">×</button>
        {step === 'credentials' ? (
          <>
            <p className="purchase-kicker">MI CUENTA</p>
            <h2 id="login-title">Iniciá sesión para comprar</h2>
            <p>Tu sesión es necesaria para reservar asientos y recibir las entradas.</p>
            <form onSubmit={sendVerificationCode}>
              <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="vos@email.com" /></label>
              <label>Contraseña<input required minLength="6" type="password" autoComplete="current-password" placeholder="Mínimo 6 caracteres" /></label>
              <button className="checkout-button" type="submit">Enviar código de verificación</button>
            </form>
            <small>Demo local: no se guardan contraseñas ni se envían correos reales.</small>
          </>
        ) : (
          <>
            <p className="purchase-kicker">VERIFICÁ TU CORREO</p>
            <h2 id="login-title">Ingresá el código</h2>
            <p>Enviamos un código de verificación a <strong>{email}</strong>.</p>
            <p className="simulation-code">Simulación: tu código es <strong>{verificationCode}</strong></p>
            <form onSubmit={verifyCode}>
              <label>Código de seis dígitos<input required value={enteredCode} onChange={(event) => setEnteredCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" pattern="[0-9]{6}" placeholder="000000" autoFocus /></label>
              {codeError && <p className="payment-error" role="alert">{codeError}</p>}
              <button className="checkout-button" type="submit">Verificar correo e ingresar</button>
              <button className="secondary-login-button" type="button" onClick={() => setStep('credentials')}>Usar otro email</button>
            </form>
            <small>En producción, este código llegará al correo indicado. Por ahora se muestra solo para probar el flujo.</small>
          </>
        )}
      </section>
    </div>
  );
}

export default LoginModal;
