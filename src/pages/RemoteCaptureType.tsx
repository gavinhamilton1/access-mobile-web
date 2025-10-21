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
  selectedProgram?: string;
  programName?: string;
}

const RemoteCaptureType: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const selectedProgram = state?.selectedProgram || '';
  const programName = state?.programName || '';

  const handleBack = () => {
    history.goBack();
  };

  const handleCancel = () => {
    history.push('/deposits');
  };

  const handleCheckAndDocuments = () => {
    history.push('/choose-group', {
      captureType: 'Check and document(s)',
      selectedProgram: selectedProgram,
      programName: programName
    });
  };

  const handleCheckOnly = () => {
    history.push('/choose-group', {
      captureType: 'Check only',
      selectedProgram: selectedProgram,
      programName: programName
    });
  };

  const handleDocumentsOnly = () => {
    history.push('/choose-group', {
      captureType: 'Document(s) only',
      selectedProgram: selectedProgram,
      programName: programName
    });
  };

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="remote-capture-header">
            <div className="header-left">
              <IonButton fill="clear" className="header-button" onClick={handleBack}>
                <IonText>Back</IonText>
              </IonButton>
            </div>
            <div className="header-center">
              <IonTitle>Choose capture type</IonTitle>
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
          <div className="capture-type-container">
            {/* Check and Documents Option */}
            <div className="capture-type-option" onClick={handleCheckAndDocuments}>
              <div className="capture-type-content">
                <IonText>
                  <h3 className="capture-type-title">Check and document(s)</h3>
                </IonText>
                <IonIcon 
                  icon="/images/ArrowForward.svg" 
                  className="capture-type-arrow"
                />
              </div>
            </div>

            {/* Check Only Option */}
            <div className="capture-type-option" onClick={handleCheckOnly}>
              <div className="capture-type-content">
                <IonText>
                  <h3 className="capture-type-title">Check only</h3>
                </IonText>
                <IonIcon 
                  icon="/images/ArrowForward.svg" 
                  className="capture-type-arrow"
                />
              </div>
            </div>

            {/* Documents Only Option */}
            <div className="capture-type-option" onClick={handleDocumentsOnly}>
              <div className="capture-type-content">
                <IonText>
                  <h3 className="capture-type-title">Document(s) only</h3>
                </IonText>
                <IonIcon 
                  icon="/images/ArrowForward.svg" 
                  className="capture-type-arrow"
                />
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RemoteCaptureType;
