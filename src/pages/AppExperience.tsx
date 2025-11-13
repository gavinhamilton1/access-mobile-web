import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const experiences = [
  {
    label: 'Access',
    icon: '/images/AccessLineLogo.svg',
    action: (history: ReturnType<typeof useHistory>) => history.push('/home'),
  },
  {
    label: 'Digital Banking',
    icon: '/images/DigitalBankingLineLogo.svg',
    action: () => (window.location.href = 'https://digital-banking-fac4.onrender.com/'),
  },
];

const AppExperience: React.FC = () => {
  const history = useHistory();

  const handleBack = () => history.goBack();

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
            <IonTitle className="text-base font-semibold text-slate-800">App experience</IonTitle>
            <div className="min-w-[64px]" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="flex min-h-full flex-col items-center justify-center gap-10 bg-slate-100 px-4 py-16">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900">J.P. Morgan Payments</h1>
            <p className="text-sm text-slate-500">Choose your experience</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {experiences.map(exp => (
              <button
                key={exp.label}
                type="button"
                onClick={() => exp.action(history)}
                className="flex w-40 flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm transition hover:border-teal-primary hover:shadow-md"
              >
                <div className="flex h-24 w-24 items-center justify-center">
                  <img src={exp.icon} alt={exp.label} className="h-24 w-24 object-contain" />
                </div>
                <span className="text-sm font-semibold text-teal-primary">{exp.label}</span>
              </button>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AppExperience;
