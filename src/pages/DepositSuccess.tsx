import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
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

  const details = [
    { label: 'Deposited to', value: `${selectedProgram} ${programName}`.trim() },
    { label: 'Capture type', value: captureType },
    { label: 'Group', value: selectedGroup },
    { label: 'Amount', value: `USD ${amount}` },
  ];

  const handleDone = () => history.push('/deposits');
  const handleCaptureAnother = () => history.push('/deposit-to');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="px-4">
          <div className="flex items-center justify-between py-2">
            <div className="min-w-[64px]" />
            <IonTitle className="text-base font-semibold text-slate-800">Deposit submitted</IonTitle>
            <IonButton
              fill="clear"
              className="text-sm font-semibold text-slate-600"
              onClick={handleDone}
            >
              Done
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="flex min-h-full flex-col items-center bg-slate-100 px-4 py-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 shadow-sm">
            <img src="/images/CircleCheck.svg" alt="Success" className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">Deposit submitted</h1>
          <p className="mt-2 text-sm text-slate-500">We’re processing your transaction now.</p>

          <div className="mt-8 w-full max-w-xl space-y-3">
            {details.map(detail => (
              <IonCard key={detail.label} className="rounded-2xl border border-slate-200 shadow-sm">
                <IonCardContent className="flex items-center justify-between gap-4 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {detail.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 text-right">{detail.value}</p>
                </IonCardContent>
              </IonCard>
            ))}
          </div>

          <div className="mt-10 flex w-full max-w-xl flex-col gap-3">
            <IonButton
              fill="outline"
              className="rounded-full border border-teal-primary py-3 text-sm font-semibold text-teal-primary"
              onClick={handleCaptureAnother}
            >
              Capture another transaction
            </IonButton>
            <IonButton
              expand="block"
              className="rounded-full bg-teal-primary py-3 text-sm font-semibold text-white shadow-lg"
              onClick={handleDone}
            >
              Back to deposits
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DepositSuccess;
