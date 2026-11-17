import { useRef, useState } from 'react';
import { createPurchase } from '../services/purchaseService';

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');
const getConcertId = (event, id) => Number(firstDefined(event?.concert_id, event?.concertId, event?.id, event?._id, id));
const getEventStock = (event) => Number(firstDefined(event?.stock, event?.cantidadDisponible, event?.available_stock));

function isInsufficientStock(data) {
  return data.stock_disponible !== undefined || /stock|disponible|insuficiente/i.test(data.message || '');
}

function getStockErrorMessage(data) {
  if (data.stock_disponible === undefined) return data.message;
  return `Stock insuficiente. Quedan ${data.stock_disponible} entradas disponibles.`;
}

function getBadRequestNotice(data) {
  if (!isInsufficientStock(data)) {
    return { type: 'error', text: 'La cantidad solicitada no es v\u00e1lida. Ingres\u00e1 al menos 1 entrada.' };
  }
  return { type: 'error', text: getStockErrorMessage(data), stock: data.stock_disponible };
}

function getPurchaseErrorNotice(error) {
  const response = error.response || {};
  const status = response.status;
  const data = response.data || {};
  if (status === 400) return getBadRequestNotice(data);
  if (status === 404) return { type: 'error', text: 'Concierto no encontrado.' };
  return { type: 'error', text: 'No pudimos completar la compra. Intent\u00e1 nuevamente.' };
}

function isValidPurchase(concertId, quantity) {
  if (!Number.isInteger(concertId)) return false;
  if (!Number.isInteger(quantity)) return false;
  return quantity >= 1;
}

function canStartPurchase(isPending, concertId, quantity) {
  return !isPending && isValidPurchase(concertId, quantity);
}

function updatePurchaseStock(errorNotice, concertId, setStockUpdate) {
  if (errorNotice.stock === undefined) return;
  setStockUpdate({ id: String(concertId), value: Number(errorNotice.stock) });
}

function completePurchase({ result, concertId, setPurchase, setStockUpdate, setNotice }) {
  setPurchase(result);
  setStockUpdate({ id: String(concertId), value: Number(result.nuevo_stock) });
  setNotice({ type: 'success', text: `\u00a1Compra realizada! Ya pod\u00e9s ver tu entrada en Mis Entradas. Compra #${result.purchase_id}; entradas creadas: ${result.tickets_created}.` });
}

function handlePurchaseFailure(error, concertId, setStockUpdate, setNotice) {
  const errorNotice = getPurchaseErrorNotice(error);
  updatePurchaseStock(errorNotice, concertId, setStockUpdate);
  setNotice(errorNotice);
}

function usePurchaseViewState() {
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const [notice, setNotice] = useState(null);
  const [purchase, setPurchase] = useState(null);
  const [stockUpdate, setStockUpdate] = useState(null);
  return { quantity, setQuantity, pending, setPending, pendingRef, notice, setNotice, purchase, setPurchase, stockUpdate, setStockUpdate };
}

export function useEventPurchase({ event, id, user }) {
  const state = usePurchaseViewState();
  const { quantity, setQuantity, pending, setPending, pendingRef, notice, setNotice, purchase, setPurchase, stockUpdate, setStockUpdate } = state;
  const concertId = getConcertId(event, id);
  const stock = stockUpdate?.id === String(concertId) ? stockUpdate.value : getEventStock(event);
  async function submitPurchase(submitEvent) {
    submitEvent.preventDefault();
    if (!user) {
      setNotice({ type: 'info', text: 'Inici\u00e1 sesi\u00f3n para comprar tus entradas.' });
      return;
    }
    if (!canStartPurchase(pendingRef.current, concertId, quantity)) return;
    pendingRef.current = true;
    setPending(true);
    setNotice(null);
    try {
      const result = await createPurchase({ concert_id: concertId, quantity });
      completePurchase({ result, concertId, setPurchase, setStockUpdate, setNotice });
    } catch (error) {
      handlePurchaseFailure(error, concertId, setStockUpdate, setNotice);
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  return { quantity, setQuantity, pending, notice, setNotice, purchase, concertId, stock, submitPurchase };
}
