import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  captureType?: string;
  selectedGroup?: string;
  selectedProgram?: string;
  programName?: string;
  frontImage?: string;
  backImage?: string;
}

const CaptureSummary: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const captureType = state?.captureType || 'Check and document(s)';
  const selectedGroup = state?.selectedGroup || 'Maintenance Orders';
  const selectedProgram = state?.selectedProgram || '15501';
  const programName = state?.programName || 'AUTOAL1 RDC PROGRAM 1 GROUPS';
  const frontImage = state?.frontImage;
  const backImage = state?.backImage;

  const [amount, setAmount] = useState('3 000 000,00');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [controlNumber, setControlNumber] = useState('');
  const [isAmountConfirmed, setIsAmountConfirmed] = useState(false);

  const isCheckCapture = captureType.includes('Check');

  const handleBack = () => {
    history.goBack();
  };

  const handleCancel = () => {
    history.push('/deposits');
  };

  const handleAmountConfirmation = (confirmed: boolean) => {
    setIsAmountConfirmed(confirmed);
  };

  const handleSubmit = () => {
    console.log('Submitting deposit:', {
      amount,
      paymentNumber,
      routingNumber,
      accountNumber,
      controlNumber,
      captureType,
      selectedGroup,
      selectedProgram,
      programName
    });
    // Navigate to success page or back to deposits
    history.push('/deposits');
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
              <IonTitle>Deposit check</IonTitle>
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
          <div className="deposit-summary-container">
            {/* Summary Cards */}
            <div className="summary-cards">
              <IonCard className="summary-card">
                <IonCardContent className="summary-card-content">
                  <div className="summary-main">{selectedProgram}</div>
                  <div className="summary-details">
                    <div>AUTOAL1 RDC</div>
                    <div>PROGRAM 1</div>
                    <div>GROUPS</div>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonCard className="summary-card">
                <IonCardContent className="summary-card-content">
                  <div className="summary-main">Group</div>
                  <div className="summary-details">
                    <div>Maintenance</div>
                    <div>Orders</div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>

            {/* Amount Display */}
            <div className="amount-display">
              <IonText>
                <h1 className="amount-text">USD {amount}</h1>
              </IonText>
            </div>

            {/* Check Images */}
            <div className="check-images">
              {frontImage && (
                <div className="image-section">
                  <IonText>
                    <h3 className="image-label">Front</h3>
                  </IonText>
                  <div className="image-container">
                    <img src={frontImage} alt="Check Front" className="check-image" />
                  </div>
                </div>
              )}

              {backImage && (
                <div className="image-section">
                  <IonText>
                    <h3 className="image-label">Back</h3>
                  </IonText>
                  <div className="image-container">
                    <img src={backImage} alt="Check Back" className="check-image" />
                  </div>
                </div>
              )}
            </div>

            {/* Amount Confirmation */}
            <div className="amount-confirmation">
              <IonText>
                <p className="confirmation-question">
                  Are you sure USD {amount} is the correct amount?
                </p>
              </IonText>
              <div className="confirmation-buttons">
                <IonButton 
                  fill="outline" 
                  className="confirmation-button"
                  onClick={() => handleAmountConfirmation(false)}
                >
                  No
                </IonButton>
                <IonButton 
                  fill="solid" 
                  className="confirmation-button"
                  onClick={() => handleAmountConfirmation(true)}
                >
                  Yes
                </IonButton>
              </div>
            </div>

            {/* Input Fields */}
            <div className="input-fields">
              <IonItem className="input-item">
                <IonLabel position="stacked">Payment/serial number</IonLabel>
                <IonInput
                  value={paymentNumber}
                  onIonInput={(e) => setPaymentNumber(e.detail.value!)}
                  placeholder="Enter payment/serial number"
                />
              </IonItem>

              <IonItem className="input-item">
                <IonLabel position="stacked">Routing number</IonLabel>
                <IonInput
                  value={routingNumber}
                  onIonInput={(e) => setRoutingNumber(e.detail.value!)}
                  placeholder="Enter routing number"
                />
              </IonItem>

              <IonItem className="input-item">
                <IonLabel position="stacked">Account number</IonLabel>
                <IonInput
                  value={accountNumber}
                  onIonInput={(e) => setAccountNumber(e.detail.value!)}
                  placeholder="Enter account number"
                />
              </IonItem>

              <IonItem className="input-item">
                <IonLabel position="stacked">Control number</IonLabel>
                <IonInput
                  value={controlNumber}
                  onIonInput={(e) => setControlNumber(e.detail.value!)}
                  placeholder="Enter control number"
                />
              </IonItem>
            </div>

            {/* Submit Button */}
            <div className="submit-container">
              <IonButton 
                expand="block" 
                className="submit-button"
                onClick={handleSubmit}
              >
                Submit
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CaptureSummary;
