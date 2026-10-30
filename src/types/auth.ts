export interface AuthUser {
  id: string | number;
  _id?: string | number;
  email: string;
  role: string;
  nombre?: string;
  name?: string;
  alias?: string;
  cvu?: string;
  wallet_id?: string | number;
  wallet?: { id?: string | number; wallet_id?: string | number; nombre?: string; name?: string; alias?: string; cvu?: string };
  billetera?: { id?: string | number; wallet_id?: string | number; nombre?: string; name?: string; alias?: string; cvu?: string };
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
