import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import { getMe, updateMe } from '../services/userService';

const emptyProfile = { nombre: '', apellido: '', dni: '', telefono: '' };

function profileFields(profile) {
  return Object.fromEntries(Object.keys(emptyProfile).map((key) => [key, profile[key] || '']));
}

function profileErrorMessage(status) {
  if (status === 400) return 'El servidor rechazó uno o más campos.';
  if (status === 409) return 'Ese DNI ya está asociado a otra cuenta.';
  return 'No pudimos guardar los cambios.';
}

function ProfileDetails({ profile, fields, setFields, onSave, saving }) {
  return <form className="profile-form" onSubmit={onSave}>
    <label>Email<input value={profile.email} readOnly /></label>
    <label>Rol<input value={profile.role} readOnly /></label>
    {Object.keys(emptyProfile).map((key) => <label key={key}>{key[0].toUpperCase() + key.slice(1)}<input value={fields[key]} onChange={(event) => setFields({ ...fields, [key]: event.target.value })} /></label>)}
    <button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
  </form>;
}

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
      setFields(profileFields(data));
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
      setFields(profileFields(updated));
      setNotice({ type: 'success', text: 'Perfil actualizado.' });
    } catch (error) {
      setNotice({ type: 'error', text: profileErrorMessage(error.response?.status) });
    } finally { setSaving(false); }
  }

  if (loading) return <main className="my-tickets-page"><Spinner label="Cargando perfil…" /></main>;
  return <main className="my-tickets-page">
    <Link to="/">← Volver a eventos</Link><h1>Mi perfil</h1>
    <Toast type={notice?.type}>{notice?.text}</Toast>
    {profile && <ProfileDetails profile={profile} fields={fields} setFields={setFields} onSave={saveProfile} saving={saving} />}
  </main>;
}

export default ProfileView;
