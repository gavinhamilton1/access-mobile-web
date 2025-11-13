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
  selectedProgram?: string;
  programName?: string;
}

const captureOptions = [
  { label: 'Check and document(s)', value: 'Check and document(s)' },
  { label: 'Check only', value: 'Check only' },
  { label: 'Document(s) only', value: 'Document(s) only' },
];

const RemoteCaptureType: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const selectedProgram = state?.selectedProgram || '';
  const programName = state?.programName || '';

  const handleBack = () => history.goBack();
  const handleCancel = () => history.push('/deposits');

  const handleSelect = (captureType: string) => {
    history.push('/choose-group', {
      captureType,
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
            <IonTitle className="text-base font-semibold text-slate-800">Choose capture type</IonTitle>
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
        <div className="space-y-4 bg-slate-100 p-4 pb-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Program</p>
            <p className="text-sm font-semibold text-slate-900">{programName || 'Select a program'}</p>
            <p className="text-xs text-slate-500">{selectedProgram}</p>
          </div>

          <div className="space-y-3">
            {captureOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-sm font-semibold text-slate-900 shadow-sm transition hover:border-teal-primary hover:shadow-md"
              >
                <span>{option.label}</span>
                <img src="/images/ArrowForward.svg" alt="Select" className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RemoteCaptureType;
