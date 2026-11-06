import { useEffect, useState } from 'react';
import Toast from './Toast';

function GlobalToast() {
  const [notice, setNotice] = useState(() => {
    const saved = window.sessionStorage.getItem('entrada-global-toast');
    if (!saved) return null;
    window.sessionStorage.removeItem('entrada-global-toast');
    return { message: saved, type: 'error' };
  });

  useEffect(() => {
    const onToast = (event) => setNotice(event.detail);
    window.addEventListener('app:toast', onToast);
    return () => window.removeEventListener('app:toast', onToast);
  }, []);

  return notice && <aside className="global-toast"><Toast type={notice.type} onClose={() => setNotice(null)}>{notice.message}</Toast></aside>;
}

export default GlobalToast;
