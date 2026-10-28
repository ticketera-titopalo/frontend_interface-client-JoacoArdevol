import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMe, updateMe } from '../services/userService';
import './ProfileView.css';

const emptyForm = { nombre: '', apellido: '', telefono: '', dni: '' };

function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    getMe()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setForm({ nombre: data.nombre || '', apellido: data.apellido || '', telefono: data.telefono || '', dni: data.dni || '' });
      })
      .catch(() => { if (active) setError('No pudimos cargar tu perfil. Intentá nuevamente.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateMe(form);
      setProfile(updated);
      setForm({ nombre: updated.nombre || '', apellido: updated.apellido || '', telefono: updated.telefono || '', dni: updated.dni || '' });
      setSuccess('Tu perfil se actualizó correctamente.');
    } catch (requestError) {
      if (requestError.response?.status === 400) setError('El servidor rechazó los campos enviados. Revisá los datos e intentá otra vez.');
      else if (requestError.response?.status === 409) setError('Ese DNI ya está asociado a otra cuenta.');
      else setError('No pudimos actualizar tu perfil. Intentá nuevamente.');
    } finally {
      setPending(false);
    }
  };

  if (loading) return <main className="profile-page"><p role="status">Cargando perfil…</p></main>;
  if (!profile) return <main className="profile-page"><p role="alert">{error}</p><Link to="/">Volver a eventos</Link></main>;

  return (
    <main className="profile-page">
      <Link to="/" className="back-link">← Volver a eventos</Link>
      <header className="profile-heading"><p className="purchase-kicker">MI CUENTA</p><h1>Mi perfil</h1></header>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Nombre<input name="nombre" autoComplete="given-name" value={form.nombre} onChange={handleChange} /></label>
        <label>Apellido<input name="apellido" autoComplete="family-name" value={form.apellido} onChange={handleChange} /></label>
        <label>Teléfono<input name="telefono" type="tel" autoComplete="tel" value={form.telefono} onChange={handleChange} /></label>
        <label>DNI<input name="dni" inputMode="numeric" value={form.dni} onChange={handleChange} /></label>
        <label>Email<input value={profile.email} readOnly /></label>
        <label>Rol<input value={profile.role} readOnly /></label>
        {error && <p className="payment-error" role="alert">{error}</p>}
        {success && <p className="profile-success" role="status">{success}</p>}
        <button className="checkout-button" type="submit" disabled={pending}>{pending ? 'Guardando…' : 'Guardar cambios'}</button>
      </form>
    </main>
  );
}

export default ProfileView;
