import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import './EventPurchase.css';

const occupiedSeats = new Set(['A3', 'A7', 'B2', 'B6', 'C4', 'C8', 'D1', 'D5']);
const seatRows = ['A', 'B', 'C', 'D'];
const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');
const sectorsFor = (event) => {
  const sectors = firstDefined(event?.sectores, event?.sectors, event?.entradas, event?.tickets, []);
  return Array.isArray(sectors) ? sectors : [];
};
const sectorId = (sector, index) => firstDefined(sector?.id, sector?._id, sector?.sectorId, sector?.idSector, index);
const getErrorMessage = (error) => {
  const status = error.response?.status;
  const data = error.response?.data;
  const message = String(data?.message || data?.mensaje || data?.error || '').toLowerCase();
  if (status === 409 || status === 410 || /stock|agotad|disponib|sin entradas/.test(message)) return 'No quedan entradas disponibles en este sector.';
  if (status === 401 || status === 403) return 'Tu sesión venció. Iniciá sesión para continuar.';
  return 'No pudimos completar la compra. Intentá nuevamente en unos minutos.';
};

function EventPurchase({ event, id, user, onRequestLogin }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSector, setSelectedSector] = useState(0);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState(null);
  const [completed, setCompleted] = useState(false);
  const sectors = sectorsFor(event);
  const sector = sectors[selectedSector];
  const title = firstDefined(event?.titulo, event?.title, event?.nombre, event?.name, 'Tu próxima experiencia');
  const artist = firstDefined(event?.artista, event?.artist, 'Artista a confirmar');
  const venue = firstDefined(event?.lugar, event?.venue, event?.place, 'Lugar a confirmar');
  const price = Number(firstDefined(sector?.precio, sector?.price, event?.precio, event?.price, 0));
  const total = useMemo(() => selectedSeats.length * price, [price, selectedSeats]);
  const money = (amount) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: event?.moneda || 'ARS', maximumFractionDigits: 0 }).format(Number(amount) || 0);
  const available = (item) => item?.disponible !== false && item?.available !== false && Number(firstDefined(item?.stock, item?.cantidadDisponible, item?.availableQuantity, 1)) > 0;
  const stock = Number(firstDefined(sector?.stock, sector?.cantidadDisponible, sector?.availableQuantity));
  const sectorName = String(firstDefined(sector?.nombre, sector?.name, sector?.sector, '')).toLowerCase();
  const preferential = /preferencial|vip/.test(sectorName);
  const seatAllowed = (seatName) => preferential ? ['A', 'B'].includes(seatName[0]) : event?.demo ? ['C', 'D'].includes(seatName[0]) : true;

  const toggleSeat = (seat) => {
    if (occupiedSeats.has(seat)) return;
    setSelectedSeats((current) => current.includes(seat)
      ? current.filter((item) => item !== seat)
      : current.length < 4 && (stock <= 0 || current.length < stock) ? [...current, seat] : current);
    setNotice(null);
  };

  const submitPurchase = async (submitEvent) => {
    submitEvent.preventDefault();
    if (!user) {
      onRequestLogin();
      setNotice({ type: 'error', text: 'Iniciá sesión para comprar tus entradas.' });
      return;
    }
    if (!sector || !selectedSeats.length || !available(sector)) return;
    const form = new FormData(submitEvent.currentTarget);
    const cardNumber = String(form.get('cardNumber')).replace(/\s/g, '');
    setNotice(null);
    setPending(true);
    try {
      if (event?.demo) {
        await new Promise((resolve) => window.setTimeout(resolve, 650));
        if (cardNumber === '4000000000000002') {
          setNotice({ type: 'error', text: 'La tarjeta fue rechazada en la simulación. Probá con otra tarjeta de prueba.' });
          return;
        }
      } else {
        await apiClient.post('/compras', {
          eventoId: id,
          sectorId: sectorId(sector, selectedSector),
          cantidad: selectedSeats.length,
          asientos: selectedSeats,
          comprador: {
            nombre: form.get('nombre'),
            apellido: form.get('apellido'),
            dni: form.get('dni'),
            email: form.get('email'),
          },
        }, user.token ? { headers: { Authorization: `Bearer ${user.token}` } } : undefined);
      }
      setCompleted(true);
      setNotice({ type: 'success', text: event?.demo ? '¡Compra simulada! Tus entradas quedaron reservadas en esta demostración.' : '¡Compra realizada! Ya podés ver tu entrada en Mis Entradas.' });
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) });
    } finally {
      setPending(false);
    }
  };

  if (completed) return (
    <main className="purchase-page purchase-confirmation">
      <p className="purchase-kicker">{event?.demo ? 'SIMULACIÓN COMPLETADA' : 'COMPRA REGISTRADA'}</p>
      <h1>{event?.demo ? '¡Tus entradas están reservadas!' : '¡Compra realizada!'}</h1>
      <p>{notice?.text} <strong>{title}</strong>. Asientos: {selectedSeats.join(', ')}.</p>
      <Link to="/" className="primary-button">Volver a eventos <span>→</span></Link>
    </main>
  );

  if (!user) return (
    <main className="purchase-page">
      <Link to="/" className="back-link">← Volver a la cartelera</Link>
      <section className="login-required">
        <p className="purchase-kicker">COMPRA PROTEGIDA</p>
        <h1>Iniciá sesión para sacar tus entradas</h1>
        <p>Necesitamos identificar tu cuenta antes de reservar asientos y continuar con la compra.</p>
        <button type="button" className="checkout-button" onClick={onRequestLogin}>Iniciar sesión para continuar</button>
      </section>
    </main>
  );

  return (
    <main className="purchase-page">
      <Link to="/" className="back-link">← Volver a la cartelera</Link>
      <header className="purchase-header">
        <p className="purchase-kicker">COMPRAR ENTRADAS</p>
        <h1>{title}</h1>
        <p>{artist} · {venue} · Comprás como {user.name}</p>
        {event?.demo && <p className="demo-label">Modo demostración · usá 4111 1111 1111 1111 para aprobar</p>}
      </header>

      <form className="checkout-layout" onSubmit={submitPurchase}>
        <section className="purchase-panel seat-panel">
          <div className="panel-heading"><div><p className="step-label">1. ELEGÍ SECTOR Y BUTACAS</p><h2>Mapa de ubicaciones</h2></div><span>Máximo 4</span></div>
          {sectors.length > 0 && <div className="sector-options" role="group" aria-label="Elegí un sector">
            {sectors.map((item, index) => {
              const name = firstDefined(item?.nombre, item?.name, item?.sector, `Sector ${index + 1}`);
              const itemPrice = firstDefined(item?.precio, item?.price, event?.precio, event?.price);
              const isVip = /preferencial|vip/i.test(String(name));
              const isGeneral = /general/i.test(String(name));
              return <button key={sectorId(item, index)} type="button" className={`sector-option ${isVip ? 'vip-option' : ''} ${isGeneral ? 'general-option' : ''} ${selectedSector === index ? 'selected' : ''}`} disabled={!available(item) || pending} onClick={() => { setSelectedSector(index); setSelectedSeats([]); setNotice(null); }}>
                {isVip ? <><span className="vip-eyebrow">✦ EXPERIENCIA EXCLUSIVA</span><strong className="vip-name">VIP</strong><span className="vip-perk">Filas delanteras · ingreso prioritario</span></> : isGeneral ? <><span className="general-eyebrow">ENTRADA ESTÁNDAR</span><strong className="general-name">GENERAL</strong><span className="general-perk">Platea · filas C y D</span></> : <><strong>{name}</strong><small>Sector general</small></>}
                <span className={isVip ? 'vip-price' : isGeneral ? 'general-price' : ''}>{money(itemPrice)}</span><small>{available(item) ? (isVip ? 'Elegir experiencia VIP' : isGeneral ? 'Elegir sector General' : 'Elegir sector') : 'Agotado'}</small>
              </button>;
            })}
          </div>}
          {sector && (preferential || event?.demo) && <div className={`sector-benefit ${preferential ? 'vip-benefit' : ''}`}><strong>{preferential ? 'Ubicación VIP' : 'Sector General'}</strong>{preferential ? <ul><li>Filas A y B, las más cercanas al escenario</li><li>Ingreso prioritario al evento</li></ul> : <p>Butacas en filas C y D.</p>}</div>}
          <div className="stage"><span>ESCENARIO</span><small>FRENTE DEL ESCENARIO</small></div>
          <div className="map-orientation"><strong>PLATEA</strong><span>Filas A y B al frente</span></div>
          <div className="seat-map" aria-label="Mapa de ubicaciones: escenario al frente, cuatro butacas a cada lado del pasillo">
            {seatRows.map((row) => <div className={`seat-row ${preferential && ['A', 'B'].includes(row) ? 'vip-row' : ''}`} key={row}>
              <span className="seat-row-label" aria-hidden="true">Fila {row}</span>
              {Array.from({ length: 8 }, (_, index) => {
                const seatName = `${row}${index + 1}`;
                const restricted = !seatAllowed(seatName);
                const occupied = occupiedSeats.has(seatName);
                const selected = selectedSeats.includes(seatName);
                return <button key={seatName} type="button" className={`seat ${occupied || restricted ? 'occupied' : ''} ${selected ? 'selected' : ''}`} disabled={occupied || restricted || pending || !available(sector)} onClick={() => toggleSeat(seatName)} aria-pressed={selected} aria-label={`${seatName}${restricted ? ', no disponible en este sector' : occupied ? ', ocupado' : ''}`}>{seatName}</button>;
              }).flatMap((seatButton, index) => index === 4 ? [<span className="seat-aisle" key="aisle" aria-hidden="true">PASILLO</span>, seatButton] : [seatButton])}
            </div>)}
          </div>
          <div className="seat-legend"><span><i className="available" />Disponible</span><span><i className="selected" />Tu selección</span><span><i className="occupied" />No disponible</span></div>
          {!selectedSeats.length && <p className="selection-hint">Seleccioná al menos un asiento para continuar.</p>}
        </section>

        <aside className="checkout-side">
          <section className="purchase-panel order-summary">
            <p className="step-label">RESUMEN</p><h2>Tu compra</h2>
            <p>{sector ? firstDefined(sector.nombre, sector.name, sector.sector, `Sector ${selectedSector + 1}`) : 'No hay sectores disponibles'}</p>
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
            {notice && <p className={notice.type === 'error' ? 'payment-error' : 'payment-success'} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</p>}
            <button className="checkout-button" type="submit" disabled={!selectedSeats.length || !sector || !available(sector) || pending}>{pending ? 'Procesando compra…' : `Confirmar compra · ${money(total)}`}</button>
            {event?.demo && <small>Simulación local: 4000 0000 0000 0002 rechaza la compra. Los datos de pago no se guardan.</small>}
          </section>
        </aside>
      </form>
      <span className="purchase-id">Evento #{id}</span>
    </main>
  );
}

export default EventPurchase;
