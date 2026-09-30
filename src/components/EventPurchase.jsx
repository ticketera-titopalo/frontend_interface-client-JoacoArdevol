import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './EventPurchase.css';

const occupiedSeats = new Set(['A3', 'A7', 'B2', 'B6', 'C4', 'C8', 'D1', 'D5']);
const seatRows = ['A', 'B', 'C', 'D'];
const fieldValue = (event, ...fields) => fields.map((field) => event?.[field]).find(Boolean);

function EventPurchase({ event, id, user, onRequestLogin }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [paymentError, setPaymentError] = useState('');
  const title = fieldValue(event, 'titulo', 'title', 'nombre', 'name') || 'Tu próxima experiencia';
  const artist = fieldValue(event, 'artista', 'artist') || 'Artista a confirmar';
  const venue = fieldValue(event, 'lugar', 'venue', 'place') || 'Lugar a confirmar';
  const basePrice = Number(fieldValue(event, 'precio', 'price')) || 12000;
  const total = useMemo(() => selectedSeats.length * basePrice, [basePrice, selectedSeats]);
  const money = (amount) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);

  const toggleSeat = (seat) => {
    if (occupiedSeats.has(seat)) return;
    setSelectedSeats((current) => current.includes(seat)
      ? current.filter((item) => item !== seat)
      : current.length < 4 ? [...current, seat] : current);
  };

  const submitPurchase = (eventSubmit) => {
    eventSubmit.preventDefault();
    if (!selectedSeats.length) return;
    const cardNumber = new FormData(eventSubmit.currentTarget).get('cardNumber').replace(/\s/g, '');
    setPaymentError('');
    setPaymentStatus('processing');

    // Simulación local: no se transmite ni almacena información de pago.
    window.setTimeout(() => {
      if (cardNumber === '4000000000000002') {
        setPaymentStatus('idle');
        setPaymentError('La tarjeta fue rechazada en la simulación. Probá con otra tarjeta de prueba.');
        return;
      }
      setPaymentStatus('approved');
      setCompleted(true);
    }, 1400);
  };

  if (completed) {
    return (
      <main className="purchase-page purchase-confirmation">
        <p className="purchase-kicker">COMPRA REGISTRADA</p>
        <h1>¡Tus entradas están reservadas!</h1>
        <p>Recibirás la confirmación de <strong>{title}</strong> por correo. Asientos: {selectedSeats.join(', ')}.</p>
        <Link to="/" className="primary-button">Volver a eventos <span>→</span></Link>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="purchase-page">
        <Link to="/" className="back-link">← Volver a la cartelera</Link>
        <section className="login-required">
          <p className="purchase-kicker">COMPRA PROTEGIDA</p>
          <h1>Iniciá sesión para sacar tus entradas</h1>
          <p>Necesitamos identificar tu cuenta antes de reservar asientos y continuar con el pago.</p>
          <button type="button" className="checkout-button" onClick={onRequestLogin}>Iniciar sesión para continuar</button>
        </section>
      </main>
    );
  }

  return (
    <main className="purchase-page">
      <Link to="/" className="back-link">← Volver a la cartelera</Link>
      <header className="purchase-header">
        <p className="purchase-kicker">COMPRAR ENTRADAS</p>
        <h1>{title}</h1>
        <p>{artist} · {venue} · Comprás como {user.name}</p>
      </header>

      <form className="checkout-layout" onSubmit={submitPurchase}>
        <section className="purchase-panel seat-panel">
          <div className="panel-heading"><div><p className="step-label">1. ELEGÍ TUS ASIENTOS</p><h2>Mapa de ubicaciones</h2></div><span>Máximo 4</span></div>
          <div className="stage">ESCENARIO</div>
          <div className="seat-map" aria-label="Mapa de asientos">
            {seatRows.flatMap((row) => Array.from({ length: 8 }, (_, index) => {
              const seat = `${row}${index + 1}`;
              const occupied = occupiedSeats.has(seat);
              const selected = selectedSeats.includes(seat);
              return <button key={seat} type="button" className={`seat ${occupied ? 'occupied' : ''} ${selected ? 'selected' : ''}`} disabled={occupied} onClick={() => toggleSeat(seat)} aria-pressed={selected}>{seat}</button>;
            }))}
          </div>
          <div className="seat-legend"><span><i className="available" />Disponible</span><span><i className="selected" />Seleccionado</span><span><i className="occupied" />Ocupado</span></div>
          {!selectedSeats.length && <p className="selection-hint">Seleccioná al menos un asiento para continuar.</p>}
        </section>

        <aside className="checkout-side">
          <section className="purchase-panel order-summary">
            <p className="step-label">RESUMEN</p><h2>Tu compra</h2>
            <p>{selectedSeats.length ? `Asientos: ${selectedSeats.join(', ')}` : 'Todavía no elegiste asientos'}</p>
            <div><span>{selectedSeats.length} entrada{selectedSeats.length === 1 ? '' : 's'}</span><strong>{money(total)}</strong></div>
          </section>
          <section className="purchase-panel form-panel">
            <p className="step-label">2. TUS DATOS</p><h2>Datos del comprador</h2>
            <div className="form-grid"><label>Nombre<input required name="nombre" autoComplete="given-name" /></label><label>Apellido<input required name="apellido" autoComplete="family-name" /></label></div>
            <label>DNI<input required name="dni" inputMode="numeric" pattern="[0-9]{7,8}" title="Ingresá un DNI de 7 u 8 dígitos" /></label>
            <label>Email<input required type="email" name="email" autoComplete="email" /></label>
            <p className="step-label payment-label">3. FORMA DE PAGO</p>
            <label>Tipo de tarjeta<select name="paymentMethod" defaultValue="credito"><option value="credito">Tarjeta de crédito</option><option value="debito">Tarjeta de débito</option></select></label>
            <label>Tarjeta de crédito o débito<input required name="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" pattern="[0-9 ]{15,19}" /></label>
            <div className="form-grid"><label>Vencimiento<input required name="expiration" inputMode="numeric" placeholder="MM/AA" pattern="(0[1-9]|1[0-2])/[0-9]{2}" /></label><label>CVV<input required name="cvv" inputMode="numeric" autoComplete="cc-csc" placeholder="123" pattern="[0-9]{3,4}" /></label></div>
            {paymentError && <p className="payment-error" role="alert">{paymentError}</p>}
            <button className="checkout-button" type="submit" disabled={!selectedSeats.length || paymentStatus === 'processing'}>{paymentStatus === 'processing' ? 'Procesando pago simulado…' : `Confirmar compra · ${money(total)}`}</button>
            <small>Simulación local: usá 4111 1111 1111 1111 para aprobar o 4000 0000 0000 0002 para simular un rechazo. No se guardan ni procesan datos reales.</small>
          </section>
        </aside>
      </form>
      <span className="purchase-id">Evento #{id}</span>
    </main>
  );
}

export default EventPurchase;
