export interface AuthUser {
  id: string | number;
  _id?: string | number;
  email: string;
  role: string;
  nombre?: string;
  apellido?: string;
  dni?: string;
  telefono?: string;
}

export interface AuthSession {
  token: string;
  refreshToken?: string | null;
  user: AuthUser;
}
