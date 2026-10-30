import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import { getMe, updateMe } from '../services/userService';

const emptyProfile = { nombre: '', apellido: '', dni: '', telefono: '' };

function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [fields, setFields] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let active = true;
    getMe().then((data) => {
      if (!active) return;
      setProfile(data);
      setFields({ nombre: data.nombre || '', apellido: data.apellido || '', dni: data.dni || '', telefono: data.telefono || '' });
    }).catch(() => { if (active) setNotice({ type: 'error', text: 'No pudimos cargar tu perfil.' }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const updated = await updateMe(fields);
      setProfile(updated);
      setFields({ nombre: updated.nombre || '', apellido: updated.apellido || '', dni: updated.dni || '', telefono: updated.telefono || '' });
      setNotice({ type: 'success', text: 'Perfil actualizado.' });
    } catch (error) {
      const status = error.response?.status;
      const text = status === 400 ? 'El servidor rechazó uno o más campos.' : status === 409 ? 'Ese DNI ya está asociado a otra cuenta.' : 'No pudimos guardar los cambios.';
      setNotice({ type: 'error', text });
    } finally { setSaving(false); }
  }

  if (loading) return <main className="my-tickets-page"><Spinner label="Cargando perfil…" /></main>;
  return <main className="my-tickets-page">
    <Link to="/">← Volver a eventos</Link><h1>Mi perfil</h1>
    <Toast type={notice?.type}>{notice?.text}</Toast>
    {profile && <form className="profile-form" onSubmit={saveProfile}>
      <label>Email<input value={profile.email} readOnly /></label>
      <label>Rol<input value={profile.role} readOnly /></label>
      {Object.keys(emptyProfile).map((key) => <label key={key}>{key[0].toUpperCase() + key.slice(1)}<input value={fields[key]} onChange={(event) => setFields({ ...fields, [key]: event.target.value })} /></label>)}
      <button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
    </form>}
  </main>;
}

export default ProfileView;
