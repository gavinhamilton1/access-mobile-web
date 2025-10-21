import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonAlert
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  selectedItems?: any[];
  actionType?: 'approve' | 'release';
}

const ApproveRelease: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [actionType, setActionType] = useState<'approve' | 'release'>('approve');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Get selected items from location state
    const state = location.state as LocationState;
    if (state?.selectedItems) {
      setSelectedItems(state.selectedItems);
    }
    if (state?.actionType) {
      setActionType(state.actionType);
    }

    return () => clearTimeout(timer);
  }, [location.state]);

  const handleConfirm = () => {
    setShowAlert(true);
  };

  const handleAlertDismiss = () => {
    setShowAlert(false);
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="approve-release-header">
            <div className="header-left">
              <IonButton fill="clear" className="header-button" onClick={handleCancel}>
                <IonText>Back</IonText>
              </IonButton>
            </div>
            <div className="header-center">
              <IonTitle>{actionType === 'approve' ? 'Approve' : 'Release'}</IonTitle>
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
          {isLoading ? (
            <div className="loading-container">
              <IonSpinner name="crescent" />
            </div>
          ) : (
            <div className="approve-release-content">
              {selectedItems.map((item, index) => (
                <div key={index} className="approval-item-wrapper">
                  <div className="approval-item">
                    <div className="approval-left">
                      <IonText>
                        <h3 className="approval-id">{item.id}</h3>
                      </IonText>
                      <IonText color="medium">
                        <p className="approval-from">{item.from}</p>
                      </IonText>
                    </div>
                    
                    <div className="approval-right">
                      <div className="approval-type-section">
                        <IonText color="medium">
                          <p className="approval-type">{item.type}</p>
                        </IonText>
                        <IonText>
                          <p className="approval-amount">{item.amount}</p>
                        </IonText>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <div className="confirm-button-container">
          <IonButton 
            fill="solid" 
            className="confirm-button"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            Confirm
          </IonButton>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={handleAlertDismiss}
        header="Confirmation"
        message={`${actionType === 'approve' ? 'Approve' : 'Release'} Confirmed`}
        buttons={['OK']}
        cssClass="light-alert"
      />
    </IonPage>
  );
};

export default ApproveRelease;
