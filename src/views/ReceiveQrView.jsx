import { useMemo, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { consultarIntenciones, rechazarIntencion, transferir } from '../services/paymentService';
import './wallet.css';

function ReceiveQrView() {
  const { user } = useSession();
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [intents, setIntents] = useState([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const destination = user?.cvu || user?.alias;
  const qrValue = useMemo(() => destination && Number(amount) > 0 ? JSON.stringify({ destino: destination, monto: Number(amount), concepto: concept.trim() }) : '', [destination, amount, concept]);

  async function refresh() {
    setError(''); setNotice('');
    if (!destination) { setError('La sesión no incluye CVU ni alias para recibir pagos.'); return; }
    try { setIntents(await consultarIntenciones(destination)); }
    catch (requestError) { setError(requestError.response?.data?.message || 'No pudimos consultar las intenciones.'); }
  }

  async function handleIntent(intent, action) {
    const id = intent.transaction_id ?? intent.id;
    if (id === undefined) { setError('La intención no incluye transaction_id.'); return; }
    setBusyId(id); setError(''); setNotice('');
    try {
      if (action === 'accept') {
        const payer = intent.pagador || intent.payer || {};
        const result = await transferir({
          transaction_id: id,
          cvu_origen: intent.cvu_origen || payer.cvu,
          cvu_destino: intent.cvu_destino || user.cvu,
          monto: intent.monto,
        });
        setNotice(result.message || 'Pago aceptado y transferido.');
      } else {
        await rechazarIntencion(id);
        setNotice('Intención rechazada.');
      }
      setIntents((current) => current.filter((item) => (item.transaction_id ?? item.id) !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || (action === 'accept' ? 'No se pudo aceptar el pago.' : 'No se pudo rechazar la intención.'));
    } finally { setBusyId(null); }
  }

  return <main className="wallet-page">
    <Link to="/">← Volver a eventos</Link>
    <h1>Cobrar con QR</h1>
    <p>Generá un QR con el monto y el concepto. La identidad del pagador se muestra en las intenciones entrantes.</p>
    {!destination && <p role="alert">Falta el CVU o alias de tu billetera en la sesión.</p>}
    <form className="wallet-form" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="receive-amount">Monto</label>
      <input id="receive-amount" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
      <label htmlFor="receive-concept">Concepto</label>
      <input id="receive-concept" value={concept} onChange={(event) => setConcept(event.target.value)} />
    </form>
    {qrValue && <div className="receive-qr"><QRCodeCanvas value={qrValue} size={240} includeMargin /><p>{user?.nombre || user?.email} · {user?.alias || destination}</p></div>}
    <section className="incoming-intents">
      <h2>Intenciones entrantes</h2>
      <button type="button" onClick={refresh}>Actualizar</button>
      {!intents.length && <p>No hay intenciones cargadas.</p>}
      {intents.map((intent) => {
        const id = intent.transaction_id ?? intent.id;
        const payer = intent.pagador || intent.payer || {};
        return <article className="intent-card" key={id}>
          <p><strong>{payer.nombre || 'Pagador'}</strong> · {payer.alias || payer.cvu || 'Identidad no informada'}</p>
          <p>${Number(intent.monto || 0).toLocaleString('es-AR')} · {intent.concepto || 'Sin concepto'}</p>
          <button type="button" disabled={busyId === id} onClick={() => handleIntent(intent, 'accept')}>{busyId === id ? 'Procesando…' : 'Aceptar'}</button>{' '}
          <button type="button" disabled={busyId === id} onClick={() => handleIntent(intent, 'reject')}>Rechazar</button>
        </article>;
      })}
    </section>
    {notice && <p role="status">{notice}</p>}{error && <p role="alert">{error}</p>}
  </main>;
}

export default ReceiveQrView;
