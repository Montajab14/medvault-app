import { useState } from 'react';
import { deriveMasterKey, decryptData, base64ToSalt, hashPasswordForAuth } from '../crypto/argon';
import { loginPatient } from '../api/patient';

interface LoginProps {
  onLogin: (data: {
    email: string;
    patientData: any;
    masterKey: Uint8Array;
  }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
  console.log('DÉBUT LOGIN');
  setLoading(true);

  try {
    // 1. NOUVEAU : Hash du password côté frontend
    const passwordHash = await hashPasswordForAuth(password);
    console.log('Password hashé:', passwordHash.substring(0, 20) + '...');

    // 2. Appel API avec le hash (pas le password en clair)
    const res = await loginPatient({ email, passwordHash });
    console.log('Réponse backend:', res.data);

    // 3. Récupération du salt pour déchiffrement
    const salt = base64ToSalt(res.data.salt);
    console.log('Salt récupéré:', salt);

    // 4. Dérivation Master Key (avec password original, pas le hash !)
    const masterKey = await deriveMasterKey(password, salt);
    console.log('Master Key recréée:', masterKey);

    // 5. Déchiffrement
    const decryptedData = await decryptData(res.data.encryptedData, masterKey);
    console.log('Données déchiffrées:', decryptedData);

    onLogin({
      email,
      patientData: decryptedData,
      masterKey,
    });

  } catch (err: any) {
    console.error('Erreur login:', err);
    
    if (err.response?.status === 401) {
      alert('Email ou mot de passe incorrect');
    } else if (err.message?.includes('decrypt')) {
      alert('Mot de passe incorrect (déchiffrement échoué)');
    } else {
      alert('Erreur de connexion');
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Connexion - MedVault</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          placeholder="Email" 
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleLogin()}
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <button 
          onClick={handleLogin}
          disabled={loading}
          style={{ 
            padding: '15px', 
            fontSize: '18px', 
            backgroundColor: loading ? '#ccc' : '#2196F3', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>

      <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        Vos données sont déchiffrées localement dans votre navigateur.
        <br />
        Le serveur ne peut jamais lire vos informations médicales.
      </p>
    </div>
  );
}