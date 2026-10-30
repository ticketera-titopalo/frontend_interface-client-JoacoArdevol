import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { consultarDestino, notificarIntencion } from '../services/paymentService';
import './wallet.css';

function parseQr(raw) {
  const payload = JSON.parse(raw);
  const destination = payload.destino || payload.destination || payload.cvu || payload.alias;
  const amount = Number(payload.monto ?? payload.amount);
  if (!destination || !Number.isFinite(amount) || amount <= 0) throw new Error('El QR debe incluir destino y un monto mayor a cero.');
  return { destination: String(destination), amount, concept: String(payload.concepto || payload.concept || '') };
}

function QrScanner({ onScan, onError }) {
  const scanner = useRef(null);
  const handled = useRef(false);
  const callbacks = useRef({ onScan, onError });
  useEffect(() => { callbacks.current = { onScan, onError }; }, [onError, onScan]);
  useEffect(() => {
    const instance = new Html5Qrcode('payment-qr-reader');
    scanner.current = instance;
    let active = true;
    instance.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } }, async (decoded) => {
      if (handled.current) return;
      handled.current = true;
      try { await instance.stop(); } catch { /* La cámara pudo haberse detenido durante el desmontaje. */ }
      if (active) callbacks.current.onScan(decoded);
    }, () => {}).catch((error) => { if (active) callbacks.current.onError(error); });
    return () => {
      active = false;
      if (instance.isScanning) instance.stop().catch(() => {}).finally(() => instance.clear().catch(() => {}));
      else instance.clear().catch(() => {});
    };
  }, []);
  return <div id="payment-qr-reader" className="qr-reader" />;
}

function PayWithQrView() {
  const { user } = useSession();
  const [scanning, setScanning] = useState(false);
  const [raw, setRaw] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function checkQr(value) {
    setError(''); setMessage(''); setRecipient(null); setQrData(null);
    try {
      const parsed = parseQr(value);
      const verified = await consultarDestino(parsed.destination);
      setQrData(parsed);
      setRecipient(verified);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'No pudimos validar el QR.');
    }
  }

  async function pay() {
    const payer = { wallet_id: user?.wallet_id, nombre: user?.nombre || user?.name, alias: user?.alias, cvu: user?.cvu };
    if (!payer.wallet_id || !payer.nombre || !payer.alias || !payer.cvu) {
      setError('Tu sesión no incluye la identidad completa de la billetera. Volvé a iniciar sesión o contactá soporte.');
      return;
    }
    setBusy(true); setError('');
    try {
      await notificarIntencion({ destino: qrData.destination, pagador: payer, monto: qrData.amount, concepto: qrData.concept });
      setMessage('Intención enviada. El cobrador debe aceptarla para completar el pago.');
      setRecipient(null); setQrData(null); setRaw('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No pudimos enviar la intención de pago.');
    } finally { setBusy(false); }
  }

  return <main className="wallet-page">
    <Link to="/">← Volver a eventos</Link>
    <h1>Pagar con QR</h1>
    <p>Escaneá el QR del cobrador. Confirmaremos sus datos con la billetera antes de enviar la intención.</p>
    {!recipient && !scanning && <button type="button" onClick={() => { setError(''); setScanning(true); }}>Abrir cámara</button>}
    {scanning && <><QrScanner onScan={(text) => { setScanning(false); setRaw(text); checkQr(text); }} onError={(e) => { setScanning(false); setError(e.message || 'No se pudo abrir la cámara. Verificá el permiso y usá HTTPS.'); }} /><button type="button" onClick={() => setScanning(false)}>Cancelar cámara</button></>}
    {!recipient && <form className="wallet-form" onSubmit={(event) => { event.preventDefault(); checkQr(raw); }}>
      <label htmlFor="qr-data">O pegá el contenido JSON del QR</label>
      <textarea id="qr-data" rows="3" value={raw} onChange={(event) => setRaw(event.target.value)} placeholder={'{"destino":"alias-o-cvu","monto":1200,"concepto":"Entrada"}'} />
      <button type="submit" disabled={!raw.trim()}>Consultar destino</button>
    </form>}
    {recipient && qrData && <section className="wallet-confirmation">
      <h2>Confirmá el pago</h2>
      <dl><div><dt>Nombre</dt><dd>{recipient.nombre}</dd></div><div><dt>Alias</dt><dd>{recipient.alias}</dd></div><div><dt>Monto</dt><dd>${qrData.amount.toLocaleString('es-AR')}</dd></div><div><dt>Concepto</dt><dd>{qrData.concept || 'Sin concepto'}</dd></div></dl>
      <p>Identidad confirmada por la billetera destino. Pagás como {user?.nombre || user?.email}.</p>
      <button type="button" onClick={pay} disabled={busy}>{busy ? 'Enviando…' : 'Enviar intención'}</button>
      <button type="button" onClick={() => { setRecipient(null); setQrData(null); }}>Cancelar</button>
    </section>}
    {message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}
  </main>;
}

export default PayWithQrView;
