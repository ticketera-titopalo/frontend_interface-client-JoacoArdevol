import { useCallback, useMemo, useState } from 'react';
import { login as requestLogin, logout as requestLogout } from '../services/authService';
import SessionContext from './sessionContext';

const TOKEN_KEY = 'entrada-token';
const USER_KEY = 'entrada-user';
const REFRESH_TOKEN_KEY = 'entrada-refresh-token';

function clearStoredSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function hasStoredUserFields(user) {
  if (!user) return false;
  if (user.id === undefined) return false;
  if (!user.email) return false;
  return Boolean(user.role);
}

function parseStoredUser(value) {
  if (!value) return null;
  const user = JSON.parse(value);
  if (!hasStoredUserFields(user)) return null;
  return user;
}

function readSession() {
  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const userValue = window.localStorage.getItem(USER_KEY);
    if (!token || !userValue) return null;
    const user = parseStoredUser(userValue);
    if (!user) return null;
    return { token, refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY), user };
  } catch {
    clearStoredSession();
    return null;
  }
}

function hasLoginCredentials(result) {
  return Boolean(result?.access_token && result.refresh_token && result.user);
}

function createSessionUser(userData, email) {
  return {
    id: userData.id ?? userData._id,
    email: userData.email || email,
    role: userData.role || 'user',
    nombre: userData.nombre,
    apellido: userData.apellido,
    dni: userData.dni,
    telefono: userData.telefono,
  };
}

function isValidSessionUser(user) {
  if (user.id === undefined) return false;
  return Boolean(user.email);
}

function persistSession(session) {
  window.localStorage.setItem(TOKEN_KEY, session.token);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

function useSignIn(setSession) {
  return useCallback(async (email, password) => {
    const result = await requestLogin(email, password);
    if (!hasLoginCredentials(result)) throw new Error('La respuesta del servidor no contiene una sesi\u00f3n v\u00e1lida.');
    const user = createSessionUser(result.user, email);
    if (!isValidSessionUser(user)) throw new Error('La respuesta del servidor no contiene un usuario v\u00e1lido.');
    const nextSession = { token: result.access_token, refreshToken: result.refresh_token, user };
    persistSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }, [setSession]);
}

function useLogout(session, setSession) {
  return useCallback(async () => {
    const accessToken = session?.token;
    clearStoredSession();
    window.sessionStorage.clear();
    setSession(null);
    try {
      await requestLogout(accessToken);
    } catch {
      // La sesión local ya está cerrada.
    }
  }, [session, setSession]);
}

function isAdminSession(session) {
  if (!session) return false;
  if (!session.user) return false;
  return session.user.role === 'admin';
}

function createSessionContextValue(session, isAdmin, signIn, logout) {
  const token = session ? session.token : null;
  const user = session ? session.user : null;
  return { token, user, isAuthenticated: Boolean(token), isAdmin, signIn, logout };
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const signIn = useSignIn(setSession);
  const logout = useLogout(session, setSession);
  const isAdmin = useCallback(() => isAdminSession(session), [session]);
  const value = useMemo(() => createSessionContextValue(session, isAdmin, signIn, logout), [session, isAdmin, signIn, logout]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
