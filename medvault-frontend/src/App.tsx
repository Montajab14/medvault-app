import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

type Session = {
  email: string;
  patientData: {
    nom: string;
    prenom: string;
    age: number;
    symptomes: string;
  };
  masterKey: Uint8Array;
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<'login' | 'register'>('login');

  function handleLogout() {
    setSession(null);
    setView('login');
  }

  function handleRegisterSuccess() {
    setView('login');
    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
  }

  if (!session) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1>MedVault - Dossier Médical E2EE</h1>
          <p>Vos données médicales chiffrées de bout en bout</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => setView('login')}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: view === 'login' ? '#2196F3' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Connexion
          </button>
          <button
            onClick={() => setView('register')}
            style={{
              padding: '10px 20px',
              backgroundColor: view === 'register' ? '#4CAF50' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Inscription
          </button>
        </div>

        {view === 'register' ? (
          <Register onRegisterSuccess={handleRegisterSuccess} />
        ) : (
          <Login onLogin={setSession} />
        )}
      </div>
    );
  }

  return (
    <Dashboard
      email={session.email}
      patientData={session.patientData}
      onLogout={handleLogout}
    />
  );
}