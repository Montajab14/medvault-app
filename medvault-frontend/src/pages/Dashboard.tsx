interface DashboardProps {
  email: string;
  patientData: {
    nom: string;
    prenom: string;
    age: number;
    symptomes: string;
  };
  onLogout: () => void;
}

export default function Dashboard({ email, patientData, onLogout }: DashboardProps) {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Tableau de bord - MedVault</h2>
        <button 
          onClick={onLogout}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#f44336', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Déconnexion
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p><strong>Email :</strong> {email}</p>
      </div>

      <h3 style={{ marginTop: '30px' }}>Données déchiffrées (E2EE)</h3>
      
      <div style={{ 
        backgroundColor: '#e8f5e9', 
        padding: '20px', 
        borderRadius: '8px',
        border: '2px solid #4CAF50'
      }}>
        <p><strong>Nom :</strong> {patientData.nom}</p>
        <p><strong>Prénom :</strong> {patientData.prenom}</p>
        <p><strong>Âge :</strong> {patientData.age} ans</p>
        <p><strong>Symptômes :</strong></p>
        <p style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          whiteSpace: 'pre-wrap'
        }}>
          {patientData.symptomes}
        </p>
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          <strong>Preuve Zero-Knowledge :</strong><br />
          Ces données ont été déchiffrées localement dans votre navigateur avec votre mot de passe.
          Le serveur MedVault ne stocke que des blobs chiffrés illisibles.
          <br /><br />
          Même les administrateurs ne peuvent pas accéder à vos informations médicales.
        </p>
      </div>
    </div>
  );
}