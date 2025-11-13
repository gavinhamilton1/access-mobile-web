import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonSpinner,
  IonAlert,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

type PaymentSelection = {
  id: string;
  from: string;
  type: string;
  amount: string;
};

interface LocationState {
  selectedItems?: PaymentSelection[];
  actionType?: 'approve' | 'release';
}

const ApproveRelease: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<PaymentSelection[]>([]);
  const [actionType, setActionType] = useState<'approve' | 'release'>('approve');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    const state = location.state as LocationState;

    if (state?.selectedItems) {
      setSelectedItems(state.selectedItems);
    }
    if (state?.actionType) {
      setActionType(state.actionType);
    }

    return () => clearTimeout(timer);
  }, [location.state]);

  const handleConfirm = () => setShowAlert(true);

  const handleAlertDismiss = () => {
    setShowAlert(false);
    history.goBack();
  };

  const handleCancel = () => history.goBack();

  const titleText = actionType === 'approve' ? 'Approve' : 'Release';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="px-4">
          <div className="flex items-center justify-between gap-3 py-2">
            <IonButton
              fill="clear"
              className="text-sm font-semibold text-slate-600"
              onClick={handleCancel}
            >
              Back
            </IonButton>
            <IonTitle className="text-base font-semibold text-slate-800">{titleText}</IonTitle>
            <IonButton
              fill="clear"
              className="text-sm font-semibold text-slate-600"
              onClick={handleCancel}
            >
              Cancel
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="space-y-4 bg-slate-100 p-4 pb-24">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
              <IonSpinner name="crescent" />
            </div>
          ) : selectedItems.length > 0 ? (
            selectedItems.map(item => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <IonText>
                      <h3 className="truncate text-base font-semibold text-slate-900">{item.id}</h3>
                    </IonText>
                    <IonText color="medium">
                      <p className="truncate text-sm text-slate-500">{item.from}</p>
                    </IonText>
                  </div>
                  <div className="flex flex-col items-start gap-1 text-right text-sm text-slate-500 sm:items-end">
                    <span>{item.type}</span>
                    <span className="text-base font-semibold text-slate-900">{item.amount}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              No payments selected.
            </div>
          )}
        </div>

        <div className="fixed inset-x-4 bottom-6 z-40">
          <IonButton
            expand="block"
            className="rounded-full bg-teal-primary py-3 text-sm font-semibold text-white shadow-lg"
            onClick={handleConfirm}
            disabled={isLoading || selectedItems.length === 0}
          >
            Confirm
          </IonButton>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={handleAlertDismiss}
        header="Confirmation"
        message={`${titleText} confirmed`}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default ApproveRelease;
