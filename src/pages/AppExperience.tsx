import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const AppExperience: React.FC = () => {
  const history = useHistory();

  const handleAccess = () => {
    console.log('Navigate to Access experience');
    history.push('/home');
  };

  const handleDigitalBanking = () => {
    console.log('Navigate to Digital Banking experience');
    // You can add navigation logic here
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="header-content">
            <div className="header-left">
              <IonButton 
                fill="clear" 
                onClick={handleBack}
                className="back-button"
              >
                <IonIcon icon="/images/ArrowBack.svg" />
              </IonButton>
            </div>
            <div className="header-center">
              <IonTitle>App Experience</IonTitle>
            </div>
            <div className="header-right">
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="app-experience-container">
          {/* Header Section */}
          <div className="app-experience-header">
            <IonText>
              <h1 className="brand-title">J.P. Morgan Payments</h1>
            </IonText>
            <IonText>
              <p className="instruction-text">Choose your experience</p>
            </IonText>
          </div>

          {/* Experience Options */}
          <div className="experience-options">
            {/* Access Option */}
            <div className="experience-card" onClick={handleAccess}>
              <div className="experience-icon">
                <IonIcon icon="/images/AccessLineLogo.svg" className="experience-icon-svg" />
              </div>
              <IonText>
                <p className="experience-label">Access</p>
              </IonText>
            </div>

            {/* Digital Banking Option */}
            <div className="experience-card" onClick={handleDigitalBanking}>
              <div className="experience-icon">
                <IonIcon icon="/images/DigitalBankingLineLogo.svg" className="experience-icon-svg" />
              </div>
              <IonText>
                <p className="experience-label">Digital Banking</p>
              </IonText>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AppExperience;
