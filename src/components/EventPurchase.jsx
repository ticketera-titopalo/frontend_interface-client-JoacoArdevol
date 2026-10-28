import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPurchase } from '../services/purchases';
import Toast from './Toast';
import './EventPurchase.css';

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');
const getConcertId = (event, id) => Number(firstDefined(event?.concert_id, event?.concertId, event?.id, event?._id, id));
const eventStock = (event) => Number(firstDefined(event?.stock, event?.cantidadDisponible, event?.available_stock));

function EventPurchase({ event, id, user }) {
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const [notice, setNotice] = useState(null);
  const [purchase, setPurchase] = useState(null);
  const [stockUpdate, setStockUpdate] = useState(null);
  const concertId = getConcertId(event, id);
  const stock = stockUpdate?.id === String(concertId) ? stockUpdate.value : eventStock(event);
  const title = firstDefined(event?.titulo, event?.title, event?.nombre, event?.name, 'Concierto');
  const artist = firstDefined(event?.artista, event?.artist, 'Artista a confirmar');
  const venue = firstDefined(event?.lugar, event?.venue, event?.place, 'Lugar a confirmar');
  const price = Number(firstDefined(event?.precio, event?.price, event?.precioEntrada, 0));
  const money = (amount) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: event?.moneda || 'ARS', maximumFractionDigits: 0 }).format(Number(amount) || 0);

  const submitPurchase = async (submitEvent) => {
    submitEvent.preventDefault();
    if (!user) {
      setNotice({ type: 'info', text: 'Iniciá sesión para comprar tus entradas.' });
      return;
    }
    if (pendingRef.current || !Number.isInteger(concertId) || !Number.isInteger(quantity) || quantity < 1) return;
    pendingRef.current = true;
    setPending(true);
    setNotice(null);
    try {
      const result = await createPurchase({ concert_id: concertId, quantity });
      setPurchase(result);
      setStockUpdate({ id: String(concertId), value: Number(result.nuevo_stock) });
      setNotice({ type: 'success', text: `¡Compra realizada! Ya podés ver tu entrada en Mis Entradas. Compra #${result.purchase_id}; entradas creadas: ${result.tickets_created}.` });
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data || {};
      if (status === 400 && data.stock_disponible !== undefined) {
        setStockUpdate({ id: String(concertId), value: Number(data.stock_disponible) });
        setNotice({ type: 'error', text: `Stock insuficiente. Quedan ${data.stock_disponible} entradas disponibles.` });
      } else if (status === 400) {
        setNotice({ type: 'error', text: 'La cantidad solicitada no es válida. Ingresá al menos 1 entrada.' });
      } else if (status === 404) {
        setNotice({ type: 'error', text: 'Concierto no encontrado.' });
      } else {
        setNotice({ type: 'error', text: 'No pudimos completar la compra. Intentá nuevamente.' });
      }
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  return <main className="purchase-page">
    <Link to="/" className="back-link">← Volver a la cartelera</Link>
    <header className="purchase-header">
      <p className="purchase-kicker">ENTRADAS PARA VIVIRLO EN PERSONA</p>
      <h1>{title}</h1>
      <p>{artist} · {venue}</p>
    </header>
    <section className="purchase-panel concert-purchase-panel">
      <div>
        <p className="step-label">COMPRA DE ENTRADAS</p>
        <h2>{price > 0 ? money(price) : 'Precio a confirmar'} <small>por entrada</small></h2>
        {Number.isFinite(stock) && <p className="concert-stock">{stock} entradas disponibles</p>}
      </div>
      <form onSubmit={submitPurchase} className="concert-purchase-form">
        <label htmlFor="ticket-quantity">Cantidad</label>
        <input id="ticket-quantity" type="number" min="1" max={Number.isFinite(stock) ? Math.max(1, stock) : undefined} value={quantity} onChange={(e) => setQuantity(e.target.value === '' ? 0 : Number(e.target.value))} disabled={pending || Boolean(purchase)} />
        <button className="checkout-button" type="submit" disabled={pending || Boolean(purchase) || stock === 0 || !Number.isInteger(concertId) || !Number.isInteger(quantity) || quantity < 1}>
          {pending ? 'Procesando compra…' : purchase ? 'Compra realizada' : 'Comprar'}
        </button>
      </form>
      <Toast type={notice?.type} onClose={() => setNotice(null)}>{notice?.text}</Toast>
      {!user && <p className="login-prompt">Para comprar, <Link to="/login" state={{ from: `/eventos/${id}` }}>iniciá sesión</Link> o <Link to="/register">creá una cuenta</Link>.</p>}
      {purchase && <p className="purchase-success-detail">Total: {money(purchase.total_price)} · Stock actualizado: {stock}</p>}
      {purchase && <Link className="purchase-tickets-link" to={`/mis-entradas?purchase_id=${purchase.purchase_id}`}>Ver mis entradas de esta compra</Link>}
    </section>
  </main>;
}

export default EventPurchase;
