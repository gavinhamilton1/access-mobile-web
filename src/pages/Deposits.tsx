import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonText,
  IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Deposits: React.FC = () => {
  const history = useHistory();

  const handleCaptureHistory = () => {
    console.log('Navigate to Capture History');
  };

  const handleDailySummary = () => {
    console.log('Navigate to Daily Summary');
  };

  const handleRemoteCapture = () => {
    history.push('/remote-capture-type');
  };

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <IonTitle>Remote capture</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          <div className="deposits-container">
            {/* Capture History Card */}
            <IonCard className="deposit-option-card" onClick={handleCaptureHistory}>
              <IonCardContent className="deposit-card-content">
                <div className="deposit-option">
                  <div className="deposit-icon-container">
                    <IonIcon 
                      icon="/images/Deposits.svg" 
                      className="deposit-icon"
                    />
                  </div>
                  <div className="deposit-text">
                    <IonText>
                      <h2 className="deposit-title">Capture history</h2>
                    </IonText>
                    <IonText color="medium">
                      <p className="deposit-subtitle">View a history of your deposits.</p>
                    </IonText>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Daily Summary Card */}
            <IonCard className="deposit-option-card" onClick={handleDailySummary}>
              <IonCardContent className="deposit-card-content">
                <div className="deposit-option">
                  <div className="deposit-icon-container">
                    <IonIcon 
                      icon="/images/List.svg" 
                      className="deposit-icon"
                    />
                  </div>
                  <div className="deposit-text">
                    <IonText>
                      <h2 className="deposit-title">Daily summary</h2>
                    </IonText>
                    <IonText color="medium">
                      <p className="deposit-subtitle">See an overview of the deposits you made over the last two weeks.</p>
                    </IonText>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Remote Capture Card */}
            <IonCard className="deposit-option-card" onClick={handleRemoteCapture}>
              <IonCardContent className="deposit-card-content">
                <div className="deposit-option">
                  <div className="deposit-icon-container">
                    <IonIcon 
                      icon="/images/Camera.svg" 
                      className="deposit-icon"
                    />
                  </div>
                  <div className="deposit-text">
                    <IonText>
                      <h2 className="deposit-title">Remote capture</h2>
                    </IonText>
                    <IonText color="medium">
                      <p className="deposit-subtitle">Deposit checks and documents to your account.</p>
                    </IonText>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Deposits;
