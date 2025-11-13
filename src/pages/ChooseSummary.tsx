import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
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

  const summaryOptions = [
    {
      label: 'Deposit to',
      value: `${selectedProgram} ${programName}`.trim(),
      action: () => history.push('/deposit-to'),
    },
    {
      label: 'Capture type',
      value: captureType,
      action: () => history.push('/remote-capture-type'),
    },
    {
      label: 'Group',
      value: selectedGroup,
      action: () => history.push('/choose-group', { captureType }),
    },
  ];

  const handleBack = () => history.goBack();
  const handleCancel = () => history.push('/deposits');
  const handleStartCapture = () => {
    history.push('/capture-best-practices', {
      captureType,
      selectedGroup,
      selectedProgram,
      programName,
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="px-4">
          <div className="flex items-center justify-between py-2">
            <IonButton
              fill="clear"
              className="text-sm font-semibold text-slate-600"
              onClick={handleBack}
            >
              Back
            </IonButton>
            <IonTitle className="text-base font-semibold text-slate-800">Review selection</IonTitle>
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
        <div className="space-y-4 bg-slate-100 p-4 pb-16">
          {summaryOptions.map(option => (
            <button
              key={option.label}
              type="button"
              onClick={option.action}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-teal-primary hover:shadow-md"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {option.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{option.value}</p>
              </div>
              <img src="/images/ArrowForward.svg" alt="Edit" className="h-5 w-5" />
            </button>
          ))}

          <IonButton
            expand="block"
            className="mt-4 rounded-full bg-teal-primary py-3 text-sm font-semibold text-white shadow-lg"
            onClick={handleStartCapture}
          >
            Continue
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChooseSummary;
