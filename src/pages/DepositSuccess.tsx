import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
  IonIcon
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  captureType?: string;
  selectedGroup?: string;
  selectedProgram?: string;
  programName?: string;
  amount?: string;
}

const DepositSuccess: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const captureType = state?.captureType || 'Check and document(s)';
  const selectedGroup = state?.selectedGroup || 'Maintenance Orders';
  const selectedProgram = state?.selectedProgram || '15501';
  const programName = state?.programName || 'AUTOAL1 RDC PROGRAM 1 GROUPS';
  const amount = state?.amount || '3 000 000,00';

  const handleDone = () => {
    history.push('/deposits');
  };

  const handleCaptureAnother = () => {
    history.push('/deposit-to');
  };

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="header-content">
            <div className="header-left">
            </div>
            <div className="header-center">
              <IonTitle>Success</IonTitle>
            </div>
            <div className="header-right">
              <IonButton fill="clear" className="header-button" onClick={handleDone}>
                <IonText>Done</IonText>
              </IonButton>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          <div className="success-container">
            {/* Success Icon and Message */}
            <div className="success-message">
              <div className="success-icon">
                <IonIcon icon="/images/CircleCheck.svg" className="check-icon" />
              </div>
              <IonText>
                <h1 className="success-title">Deposit submitted</h1>
              </IonText>
            </div>

            {/* Deposit Details */}
            <div className="deposit-details">
              <IonCard className="detail-card">
                <IonCardContent className="detail-card-content">
                  <div className="detail-row">
                    <IonText>
                      <span className="detail-label">Deposited to:</span>
                    </IonText>
                    <IonText>
                      <span className="detail-value">{selectedProgram} {programName}</span>
                    </IonText>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonCard className="detail-card">
                <IonCardContent className="detail-card-content">
                  <div className="detail-row">
                    <IonText>
                      <span className="detail-label">Capture type</span>
                    </IonText>
                    <IonText>
                      <span className="detail-value">{captureType}</span>
                    </IonText>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonCard className="detail-card">
                <IonCardContent className="detail-card-content">
                  <div className="detail-row">
                    <IonText>
                      <span className="detail-label">Group</span>
                    </IonText>
                    <IonText>
                      <span className="detail-value">{selectedGroup}</span>
                    </IonText>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>

            {/* Action Button */}
            <div className="action-container">
              <IonButton 
                fill="outline" 
                className="capture-another-button"
                onClick={handleCaptureAnother}
              >
                <IonText>Capture another transaction</IonText>
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DepositSuccess;
