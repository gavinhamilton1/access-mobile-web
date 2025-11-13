import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  captureType?: string;
  selectedGroup?: string;
  selectedProgram?: string;
  programName?: string;
}

const tips = [
  {
    title: 'Dark or mostly monochrome background',
    description:
      'Use a uniform, darker background—especially when the check itself is light colored.',
  },
  {
    title: 'Photograph the physical check',
    description: 'Avoid capturing screenshots or photocopies; always use the original document.',
  },
  {
    title: 'Stick to auto capture',
    description: 'Auto captured checks satisfy deposit criteria more reliably than manual shots.',
  },
  {
    title: 'Limit excessive angles',
    description: 'Hold the camera directly above the check without casting shadows.',
  },
];

const CaptureBestPractices: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const captureType = state?.captureType || 'Check and document(s)';
  const selectedGroup = state?.selectedGroup || '';
  const selectedProgram = state?.selectedProgram || '15501';
  const programName = state?.programName || 'AUTOAL1 RDC PROGRAM 1 GROUPS';

  const handleBack = () => history.goBack();

  const handleStartCapture = () => {
    history.push('/capture-check', {
      captureType,
      selectedGroup,
      selectedProgram,
      programName,
    });
  };

  const handleDoNotShowAgain = () => {
    console.log('Do not show again');
    history.goBack();
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
            <IonTitle className="text-base font-semibold text-slate-800">Remote capture tips</IonTitle>
            <div className="min-w-[64px]" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="flex min-h-full items-center justify-center bg-slate-100 px-4 py-10">
          <div className="w-full max-w-lg space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                <img src="/images/Camera.svg" alt="Camera" className="h-8 w-8 text-teal-primary" />
              </div>
            </div>

            <div className="text-center">
              <IonText>
                <h1 className="text-2xl font-semibold text-slate-900">
                  Remote capture best practices
                </h1>
              </IonText>
            </div>

            <div className="space-y-5">
              {tips.map(tip => (
                <div
                  key={tip.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center shadow-sm"
                >
                  <IonText>
                    <h3 className="text-base font-semibold text-slate-900">{tip.title}</h3>
                  </IonText>
                  <p className="mt-2 text-sm text-slate-600">{tip.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <IonButton
                expand="block"
                className="rounded-full bg-teal-primary py-3 text-sm font-semibold text-white shadow-lg"
                onClick={handleStartCapture}
              >
                Start capture
              </IonButton>
              <IonButton
                fill="clear"
                className="w-full text-sm font-semibold text-slate-500 underline"
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
