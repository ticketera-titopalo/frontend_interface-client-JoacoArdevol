export interface AuthUser {
  id: string | number;
  _id?: string | number;
  email: string;
  role: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
