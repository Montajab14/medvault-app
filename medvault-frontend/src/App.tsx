import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  const [page, setPage] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<any>(null);

  if (user) return (
    <div style={{ padding: 20 }}>
      <h2>Bienvenue, {user.email}</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(user.patientData, null, 2)}</pre>
      <button onClick={() => setUser(null)}>Se déconnecter</button>
    </div>
  );

  return (
    <div>
      <header style={{ display: 'flex', gap: 10, padding: 16 }}>
        <button onClick={() => setPage('login')}>Connexion</button>
        <button onClick={() => setPage('register')}>Inscription</button>
      </header>
      <main>
        {page === 'login' ? (
          <Login onLogin={(data) => setUser(data)} />
        ) : (
          <Register onRegisterSuccess={() => setPage('login')} />
        )}
      </main>
    </div>
  );
}