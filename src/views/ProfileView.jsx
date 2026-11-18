import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import { getMe, updateMe } from '../services/userService';

const emptyProfile = { nombre: '', apellido: '', dni: '', telefono: '' };
const profileFields = (data) => Object.fromEntries(Object.keys(emptyProfile).map((key) => [key, data[key] || '']));
function getSaveErrorMessage(status) {
  if (status === 400) return 'El servidor rechazó uno o más campos.';
  if (status === 409) return 'Ese DNI ya está asociado a otra cuenta.';
  return 'No pudimos guardar los cambios.';
}

function ProfileEditor({ profile, fields, setFields, saveProfile, saving }) {
  if (!profile) return null;
  return <form className="profile-form" onSubmit={saveProfile}>
    <label>Email<input value={profile.email} readOnly /></label>
    <label>Rol<input value={profile.role} readOnly /></label>
    {Object.keys(emptyProfile).map((key) => <label key={key}>{key[0].toUpperCase() + key.slice(1)}<input value={fields[key]} onChange={(event) => setFields({ ...fields, [key]: event.target.value })} /></label>)}
    <button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
  </form>;
}

function useProfileLoader({ setProfile, setFields, setLoading, setNotice }) {
  useEffect(() => {
    let active = true;
    getMe().then((data) => {
      if (!active) return;
      setProfile(data);
      setFields(profileFields(data));
    }).catch(() => {
      if (active) setNotice({ type: 'error', text: 'No pudimos cargar tu perfil.' });
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [setFields, setLoading, setNotice, setProfile]);
}

function useProfileSave({ fields, setProfile, setFields, setNotice }) {
  const [saving, setSaving] = useState(false);
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
      const status = error.response?.status;
      setNotice({ type: 'error', text: getSaveErrorMessage(status) });
    } finally {
      setSaving(false);
    }
  }
  return [saving, saveProfile];
}

function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [fields, setFields] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  useProfileLoader({ setProfile, setFields, setLoading, setNotice });

  const [saving, saveProfile] = useProfileSave({ fields, setProfile, setFields, setNotice });

  if (loading) return <main className="my-tickets-page"><Spinner label="Cargando perfil…" /></main>;
  return <main className="my-tickets-page">
    <Link to="/">← Volver a eventos</Link><h1>Mi perfil</h1>
    <Toast type={notice?.type}>{notice?.text}</Toast>
    <ProfileEditor profile={profile} fields={fields} setFields={setFields} saveProfile={saveProfile} saving={saving} />
  </main>;
}

export default ProfileView;
