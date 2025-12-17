import { useState } from 'react';
import { generateSalt, deriveMasterKey, encryptData, saltToBase64, hashPasswordForAuth } from '../crypto/argon';
import { registerPatient } from '../api/patient';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [symptomes, setSymptomes] = useState('');

async function handleRegister() {
  console.log('DÉBUT REGISTER');

  if (password !== confirmPassword) {
    alert('Les mots de passe ne correspondent pas');
    return;
  }

  if (password.length < 8) {
    alert('Le mot de passe doit contenir au moins 8 caractères');
    return;
  }

  try {
    // 1. Salt pour Master Key (chiffrement E2EE)
    const salt = generateSalt();
    console.log('Salt généré (E2EE):', salt);

    // 2. Master Key pour chiffrement
    const masterKey = await deriveMasterKey(password, salt);
    console.log('Master Key dérivée:', masterKey);

    // 3. Données à chiffrer
    const patientData = {
      nom,
      prenom,
      age: parseInt(age),
      symptomes,
    };
    console.log('Données à chiffrer:', patientData);

    // 4. Chiffrement AES-GCM
    const encryptedData = await encryptData(patientData, masterKey);
    console.log('Données chiffrées (Base64):', encryptedData.substring(0, 50) + '...');

    // Hash du password pour authentification 
    const passwordHash = await hashPasswordForAuth(password, email);
    console.log('Password hashé (auth):', passwordHash.substring(0, 20) + '...');


    await registerPatient({
      email,
      passwordHash, 
      salt: saltToBase64(salt),
      encryptedData,
    });

    alert('Patient enregistré ! Données E2EE sécurisées.');
    
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNom('');
    setPrenom('');
    setAge('');
    setSymptomes('');

    onRegisterSuccess();

  } catch (err) {
    console.error('Erreur register:', err);
    alert('Erreur lors de l\'inscription');
  }
}
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Inscription Patient - MedVault</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ 
              padding: '10px', 
              paddingRight: '45px',
              fontSize: '16px', 
              width: 'calc(100% - 20px)',
              boxSizing: 'border-box'
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: '20px',
              userSelect: 'none',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            style={{ 
              padding: '10px', 
              paddingRight: '45px',
              fontSize: '16px', 
              width: 'calc(100% - 20px)',
              boxSizing: 'border-box',
              borderColor: confirmPassword && password !== confirmPassword ? '#f44336' : undefined
            }}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: '20px',
              userSelect: 'none',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>

        {confirmPassword && password !== confirmPassword && (
          <p style={{ color: '#f44336', fontSize: '14px', margin: '0' }}>
            Les mots de passe ne correspondent pas
          </p>
        )}

        <hr />

        <h3>Informations médicales (chiffrées E2EE)</h3>

        <input
          placeholder="Nom"
          value={nom}
          onChange={e => setNom(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <input
          placeholder="Prénom"
          value={prenom}
          onChange={e => setPrenom(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <input
          placeholder="Âge"
          type="number"
          value={age}
          onChange={e => setAge(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <textarea
          placeholder="Symptômes / Notes médicales"
          value={symptomes}
          onChange={e => setSymptomes(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', minHeight: '100px' }}
        />

        <button 
          type="button" 
          onClick={handleRegister}
          style={{ 
            padding: '15px', 
            fontSize: '18px', 
            backgroundColor: '#4CAF50', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          S'inscrire (E2EE)
        </button>
      </div>
    </div>
  );
}