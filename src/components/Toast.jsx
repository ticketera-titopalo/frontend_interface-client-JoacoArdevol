import './Toast.css';

function Toast({ type = 'info', children, onClose }) {
  if (!children) return null;
  return <div className={`app-toast ${type}`} role={type === 'error' ? 'alert' : 'status'}>
    <span>{children}</span>
    {onClose && <button type="button" aria-label="Cerrar aviso" onClick={onClose}>×</button>}
  </div>;
}

export default Toast;
