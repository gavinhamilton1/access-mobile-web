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
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  captureType?: string;
  selectedGroup?: string;
  selectedProgram?: string;
  programName?: string;
}

const ChooseSummary: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const captureType = state?.captureType || 'Check and document(s)';
  const selectedGroup = state?.selectedGroup || 'Maintenance Orders';
  const selectedProgram = state?.selectedProgram || '15501';
  const programName = state?.programName || 'AUTOAL1 RDC PROGRAM 1 GROUPS';

  const handleBack = () => {
    history.goBack();
  };

  const handleCancel = () => {
    history.push('/deposits');
  };

  const handleStartCapture = () => {
    // Navigate to capture flow
    history.push('/capture-check', {
      captureType: captureType,
      selectedGroup: selectedGroup,
      selectedProgram: selectedProgram,
      programName: programName
    });
  };

  const handleEditDepositTo = () => {
    // Navigate back to program selection
    history.push('/deposit-to');
  };

  const handleEditCaptureType = () => {
    // Navigate back to capture type selection
    history.push('/remote-capture-type');
  };

  const handleEditGroup = () => {
    // Navigate back to group selection
    history.push('/choose-group', { captureType });
  };

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="header-content">
            <div className="header-left">
              <IonButton fill="clear" className="header-button" onClick={handleBack}>
                <IonText>← Back</IonText>
              </IonButton>
            </div>
            <div className="header-center">
              <IonTitle>Choose summary</IonTitle>
            </div>
            <div className="header-right">
              <IonButton fill="clear" className="header-button" onClick={handleCancel}>
                <IonText>Cancel</IonText>
              </IonButton>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          <div className="summary-container">
            {/* Deposit to Card */}
            <div className="summary-option" onClick={handleEditDepositTo}>
              <div className="summary-content">
                <div className="summary-info">
                  <div className="summary-label">Deposit to</div>
                  <div className="summary-value">{selectedProgram} {programName}</div>
                </div>
                <IonIcon 
                  icon="/images/ArrowForward.svg" 
                  className="summary-arrow"
                />
              </div>
            </div>

            {/* Capture Type Card */}
            <div className="summary-option" onClick={handleEditCaptureType}>
              <div className="summary-content">
                <div className="summary-info">
                  <div className="summary-label">Capture Type</div>
                  <div className="summary-value">{captureType}</div>
                </div>
                <IonIcon 
                  icon="/images/ArrowForward.svg" 
                  className="summary-arrow"
                />
              </div>
            </div>

            {/* Group Card */}
            <div className="summary-option" onClick={handleEditGroup}>
              <div className="summary-content">
                <div className="summary-info">
                  <div className="summary-label">Group</div>
                  <div className="summary-value">{selectedGroup}</div>
                </div>
                <IonIcon 
                  icon="/images/ArrowForward.svg" 
                  className="summary-arrow"
                />
              </div>
            </div>

            {/* Start Capture Button */}
            <div className="start-capture-container">
              <IonButton 
                expand="block" 
                className="start-capture-button"
                onClick={handleStartCapture}
              >
                Start capture
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChooseSummary;
