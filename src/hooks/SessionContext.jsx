import { useCallback, useMemo, useState } from 'react';
import { login as requestLogin, logout as requestLogout } from '../services/authService';
import SessionContext from './sessionContext';

const TOKEN_KEY = 'entrada-token';
const USER_KEY = 'entrada-user';
const REFRESH_TOKEN_KEY = 'entrada-refresh-token';
function readSession() {
  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const userValue = window.localStorage.getItem(USER_KEY);
    if (!token || !userValue) return null;
    const user = JSON.parse(userValue);
    if (!user || user.id === undefined || !user.email || !user.role) return null;
    return { token, refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY), user };
  } catch {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    return null;
  }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const signIn = useCallback(async (email, password) => {
    const result = await requestLogin(email, password);
    if (!result?.access_token || !result.refresh_token || !result.user) {
      throw new Error('La respuesta del servidor no contiene una sesión válida.');
    }

    const user = {
      id: result.user.id ?? result.user._id,
      email: result.user.email || email,
      role: result.user.role || 'user',
      nombre: result.user.nombre,
      apellido: result.user.apellido,
      dni: result.user.dni,
      telefono: result.user.telefono,
    };
    if (user.id === undefined || !user.email) {
      throw new Error('La respuesta del servidor no contiene un usuario válido.');
    }

    const nextSession = { token: result.access_token, refreshToken: result.refresh_token, user };
    window.localStorage.setItem(TOKEN_KEY, nextSession.token);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, nextSession.refreshToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    setSession(nextSession);
    return nextSession;
  }, []);

  const logout = useCallback(async () => {
    const accessToken = session?.token;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.sessionStorage.clear();
    setSession(null);
    try { await requestLogout(accessToken); } catch { /* La sesión local ya está cerrada. */ }
  }, [session]);

  const isAdmin = useCallback(() => session?.user?.role === 'admin', [session]);
  const value = useMemo(() => ({
    token: session?.token || null,
    user: session?.user || null,
    isAuthenticated: Boolean(session?.token),
    isAdmin,
    signIn,
    logout,
  }), [session, isAdmin, signIn, logout]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

