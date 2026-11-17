import { Link } from 'react-router-dom';
import { useEventPurchase } from '../hooks/useEventPurchase';
import Toast from './Toast';
import './EventPurchase.css';

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

function isValidQuantity(quantity) {
  if (!Number.isInteger(quantity)) return false;
  return quantity >= 1;
}

function isPurchaseDisabled(flow) {
  if (flow.pending) return 'Procesando compra\u2026';
  if (flow.purchase) return true;
  if (flow.stock === 0) return true;
  if (!Number.isInteger(flow.concertId)) return true;
  return !isValidQuantity(flow.quantity);
}

function isInputDisabled(flow) {
  return flow.pending || Boolean(flow.purchase);
}

function getPurchaseButtonText(flow) {
  if (flow.pending) return 'Procesando compra\u2026';
  if (flow.purchase) return 'Compra realizada';
  return 'Comprar';
}

function PurchaseProgress({ pending }) {
  if (!pending) return null;
  return <span className="spinner" aria-hidden="true" />;
}

function PurchaseHeader({ title, artist, venue }) {
  return <header className="purchase-header">
    <p className="purchase-kicker">ENTRADAS PARA VIVIRLO EN PERSONA</p>
    <h1>{title}</h1>
    <p>{artist} &#183; {venue}</p>
  </header>;
}

function PurchaseDetails({ price, stock, money }) {
  return <div>
    <p className="step-label">COMPRA DE ENTRADAS</p>
    <h2>{price > 0 ? money(price) : 'Precio a confirmar'} <small>por entrada</small></h2>
    {Number.isFinite(stock) && <p className="concert-stock">{stock} entradas disponibles</p>}
  </div>;
}

function PurchaseForm({ flow }) {
  return <form onSubmit={flow.submitPurchase} className="concert-purchase-form">
    <label htmlFor="ticket-quantity">Cantidad</label>
    <input id="ticket-quantity" type="number" min="1" max={Number.isFinite(flow.stock) ? Math.max(1, flow.stock) : undefined} value={flow.quantity} onChange={(event) => flow.setQuantity(event.target.value === '' ? 0 : Number(event.target.value))} disabled={isInputDisabled(flow)} />
    <button className="checkout-button" type="submit" aria-busy={flow.pending} disabled={isPurchaseDisabled(flow)}>
      <PurchaseProgress pending={flow.pending} />{getPurchaseButtonText(flow)}
    </button>
  </form>;
}

function PurchaseNotice({ notice, onClose }) {
  return <Toast type={notice?.type} onClose={onClose}>{notice?.text}</Toast>;
}

function LoginPrompt({ user, id }) {
  if (user) return null;
  return <p className="login-prompt">Para comprar, <Link to="/login" state={{ from: `/eventos/${id}` }}>inici&aacute; sesi&oacute;n</Link> o <Link to="/register">cre&aacute; una cuenta</Link>.</p>;
}

function PurchaseSummary({ purchase, stock, money }) {
  if (!purchase) return null;
  return <>
    <p className="purchase-success-detail">Total: {money(purchase.total_price)} &#183; Stock actualizado: {stock}</p>
    <Link className="purchase-tickets-link" to={`/mis-entradas?purchase_id=${purchase.purchase_id}`}>Ver mis entradas de esta compra</Link>
  </>;
}

function PurchaseFeedback({ flow, user, id, money }) {
  return <>
    <PurchaseNotice notice={flow.notice} onClose={() => flow.setNotice(null)} />
    <LoginPrompt user={user} id={id} />
    <PurchaseSummary purchase={flow.purchase} stock={flow.stock} money={money} />
  </>;
}

function getEventValue(event, fields, fallback) {
  if (!event) return fallback;
  const value = firstDefined(...fields.map((field) => event[field]));
  if (value === undefined) return fallback;
  return value;
}

function getEventText(event, id) {
  return {
    title: getEventValue(event, ['titulo', 'title', 'nombre', 'name'], 'Concierto'),
    artist: getEventValue(event, ['artista', 'artist'], 'Artista a confirmar'),
    venue: getEventValue(event, ['lugar', 'venue', 'place'], 'Lugar a confirmar'),
    price: Number(getEventValue(event, ['precio', 'price', 'precioEntrada'], 0)),
    currency: event?.moneda || 'ARS',
    id,
  };
}

function EventPurchase({ event, id, user }) {
  const flow = useEventPurchase({ event, id, user });
  const eventText = getEventText(event, id);
  const money = (amount) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: eventText.currency, maximumFractionDigits: 0 }).format(Number(amount) || 0);

  return <main className="purchase-page">
    <Link to="/" className="back-link">&#8592; Volver a la cartelera</Link>
    <PurchaseHeader title={eventText.title} artist={eventText.artist} venue={eventText.venue} />
    <section className="purchase-panel concert-purchase-panel">
      <PurchaseDetails price={eventText.price} stock={flow.stock} money={money} />
      <PurchaseForm flow={flow} />
      <PurchaseFeedback flow={flow} user={user} id={eventText.id} money={money} />
    </section>
  </main>;
}

export default EventPurchase;
