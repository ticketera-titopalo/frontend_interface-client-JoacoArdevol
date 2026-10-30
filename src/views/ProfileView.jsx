import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { getProfile } from '../services/profileService';

function ProfileView() {
  const { user: sessionUser } = useSession();
  const [profile, setProfile] = useState(sessionUser);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getProfile().then((data) => { if (active) setProfile(data); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);

  return <main className="my-tickets-page">
    <Link to="/">← Volver a eventos</Link>
    <h1>Mi perfil</h1>
    {error && <p role="alert">No pudimos actualizar tus datos. Mostramos la información de tu sesión.</p>}
    <dl><div><dt>Nombre</dt><dd>{profile?.nombre || profile?.name || 'Sin informar'}</dd></div>
      <div><dt>Email</dt><dd>{profile?.email || 'Sin informar'}</dd></div>
      <div><dt>Rol</dt><dd>{profile?.role || 'Usuario'}</dd></div></dl>
  </main>;
}

export default ProfileView;
