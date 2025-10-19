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

const CaptureBestPractices: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const captureType = state?.captureType || 'Check and document(s)';
  const selectedGroup = state?.selectedGroup || '';
  const selectedProgram = state?.selectedProgram || '15501';
  const programName = state?.programName || 'AUTOAL1 RDC PROGRAM 1 GROUPS';

  const handleBack = () => {
    history.goBack();
  };

  const handleStartCapture = () => {
    // Navigate to summary page with all selections
    history.push('/choose-summary', {
      captureType: captureType,
      selectedGroup: selectedGroup,
      selectedProgram: selectedProgram,
      programName: programName
    });
  };

  const handleDoNotShowAgain = () => {
    // Handle "Do not show again" functionality
    console.log('Do not show again');
    history.goBack();
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
              <IonTitle>Remote capture tips</IonTitle>
            </div>
            <div className="header-right">
              {/* Empty for symmetry */}
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          <div className="capture-tips-container">
            {/* Camera Icon */}
            <div className="camera-icon-container">
              <IonIcon 
                icon="/images/Camera.svg" 
                className="camera-icon"
              />
            </div>

            {/* Main Heading */}
            <div className="tips-heading">
              <IonText>
                <h1 className="main-heading">Remote capture best practices</h1>
              </IonText>
            </div>

            {/* Tips List */}
            <div className="tips-list">
              {/* Tip 1 */}
              <div className="tip-item">
                <IonText>
                  <h3 className="tip-title">Dark or mostly monochrome background</h3>
                </IonText>
                <IonText color="medium">
                  <p className="tip-description">
                    The image background should be a uniform, preferably darker color, especially if the check itself is light colored.
                  </p>
                </IonText>
              </div>

              {/* Tip 2 */}
              <div className="tip-item">
                <IonText>
                  <h3 className="tip-title">Photograph physical check</h3>
                </IonText>
                <IonText color="medium">
                  <p className="tip-description">
                    Try not to take an image of a check.
                  </p>
                </IonText>
              </div>

              {/* Tip 3 */}
              <div className="tip-item">
                <IonText>
                  <h3 className="tip-title">Stick to auto capture</h3>
                </IonText>
                <IonText color="medium">
                  <p className="tip-description">
                    Auto captured checks meet deposit criteria more than checks captured manually.
                  </p>
                </IonText>
              </div>

              {/* Tip 4 */}
              <div className="tip-item">
                <IonText>
                  <h3 className="tip-title">No excessive angles</h3>
                </IonText>
                <IonText color="medium">
                  <p className="tip-description">
                    Hold camera as close to directly above the check as possible without casting shadows.
                  </p>
                </IonText>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="capture-actions">
              <IonButton 
                expand="block" 
                className="start-capture-button"
                onClick={handleStartCapture}
              >
                Start capture
              </IonButton>
              
              <IonButton 
                fill="clear" 
                className="do-not-show-button"
                onClick={handleDoNotShowAgain}
              >
                Do not show again
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CaptureBestPractices;
