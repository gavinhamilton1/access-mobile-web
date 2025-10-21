import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/react';
import { notifications, chevronDown, checkmark, document, informationCircle, closeCircle, camera } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Tab1: React.FC = () => {
  const history = useHistory();

  const handleCaptureDeposit = () => {
    history.push('/deposit-to');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="header-content">
            <div className="welcome-section">
              <IonText color="medium">
                <p className="text-medium">Welcome, test.</p>
              </IonText>
            </div>
            <div className="header-actions">
              <img src="/images/Alert.svg" alt="Alerts" className="icon-medium" />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="page-content">
          {/* Balance Overview Card */}
          <IonCard className="card balance-card">
            <IonCardContent className="card-content">
              <div className="balance-row">
                <div className="balance-label-section">
                  <IonText color="medium">
                    <p className="text-small">Current day</p>
                  </IonText>
                  <IonText>
                    <h2 className="text-large">1 063 261<span className="decimal-part">,52</span></h2>
                  </IonText>
                </div>
                <div className="balance-amount-section">
                  <IonSelect 
                    value="USD" 
                    interface="popover"
                    className="currency-select-inline"
                  >
                    <IonSelectOption value="USD">USD</IonSelectOption>
                    <IonSelectOption value="EUR">EUR</IonSelectOption>
                    <IonSelectOption value="GBP">GBP</IonSelectOption>
                  </IonSelect>
                </div>
              </div>
              
              <div className="balance-row">
                <div className="balance-label-section">
                  <IonText color="medium">
                    <p className="text-small">Prior day</p>
                  </IonText>
                  <IonText>
                    <h2 className="text-large">1 063 261<span className="decimal-part">,52</span></h2>
                  </IonText>
                </div>
                <div className="balance-amount-section">
                  {/* Empty section for alignment */}
                </div>
              </div>

              <div className="balance-divider"></div>

              <div className="balance-row">
                <div className="balance-label-section">
                  <div className="credit-debit-left">
                    <img src="/images/PiggyBank.svg" alt="Credits" className="icon-small" />
                    <span>Credits</span>
                  </div>
                </div>
                <div className="balance-amount-section">
                  <span className="text-bold">0,00</span>
                </div>
              </div>

              <div className="balance-divider"></div>

              <div className="balance-row">
                <div className="balance-label-section">
                  <div className="credit-debit-left">
                    <img src="/images/VisibilityOn.svg" alt="Debits" className="icon-small" />
                    <span>Debits</span>
                  </div>
                </div>
                <div className="balance-amount-section">
                  <span className="text-bold">(0,00)</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Payment Actions Card */}
          <IonCard className="card payment-actions-card">
            <IonCardContent className="card-content">
              <div className="card-action-item">
                <div className="card-action-left">
                  <img src="/images/Check.svg" alt="Approve" className="icon-small" />
                  <span>Approve payment</span>
                </div>
                <div className="icon-dot"></div>
              </div>
              <div className="card-action-item">
                <div className="card-action-left">
                  <img src="/images/ListCheck.svg" alt="Release" className="icon-small" />
                  <span>Release payment</span>
                </div>
                <div className="icon-dot"></div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* File Transmissions Card */}
          <IonCard className="card file-transmissions-card">
            <IonCardHeader>
              <IonCardTitle className="text-title">File Transmissions</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="card-content">
              <div className="transmission-status">
                <div className="status-item">
                  <div className="status-left">
                    <img src="/images/CircleCheck.svg" alt="Sent" className="icon-small status-icon-green" />
                    <span>Sent for processing</span>
                  </div>
                  <IonChip color="primary" className="status-count">55</IonChip>
                </div>
                <div className="status-item">
                  <div className="status-left">
                    <img src="/images/CircleInfo.svg" alt="In process" className="icon-small" />
                    <span>In process</span>
                  </div>
                  <IonChip color="primary" className="status-count">648</IonChip>
                </div>
                <div className="status-item">
                  <div className="status-left">
                    <img src="/images/CircleCross.svg" alt="Failed" className="icon-small status-icon-red" />
                    <span>Failed</span>
                  </div>
                  <IonChip color="primary" className="status-count">7</IonChip>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          
          {/* Bottom spacer to allow scrolling past fixed button */}
          <div className="bottom-spacer">
          </div>
        </div>
        {/* Fixed Floating Capture Button */}
        <div className="floating-capture-button">
          <IonButton 
            className="btn-primary floating-btn"
            onClick={handleCaptureDeposit}
          >
            <img src="/images/Camera.svg" alt="Camera" className="btn-icon" />
            Capture deposit
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
