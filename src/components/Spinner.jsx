function Spinner({ label = 'Cargando…' }) {
  return <p className="loading-state" role="status"><span className="spinner" aria-hidden="true" />{label}</p>;
}

export default Spinner;
