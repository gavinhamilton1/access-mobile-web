import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const depositsOptions = [
  {
    label: 'Capture history',
    description: 'View a history of your deposits.',
    icon: '/images/Deposits.svg',
    action: '/capture-history',
  },
  {
    label: 'Daily summary',
    description: 'See an overview of the deposits you made over the last two weeks.',
    icon: '/images/List.svg',
    action: '/daily-summary',
  },
  {
    label: 'Remote capture',
    description: 'Deposit checks and documents to your account.',
    icon: '/images/Camera.svg',
    action: '/deposit-to',
  },
];

const Deposits: React.FC = () => {
  const history = useHistory();

  const navigateTo = (path: string) => () => history.push(path);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="px-4">
          <IonTitle className="text-base font-semibold text-slate-800">Remote capture</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="space-y-4 bg-slate-100 p-4 pb-16">
          {depositsOptions.map(option => (
            <IonCard
              key={option.label}
              button
              onClick={navigateTo(option.action)}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-primary hover:shadow-md"
            >
              <IonCardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                  <img src={option.icon} alt={option.label} className="h-6 w-6 text-teal-primary" />
                </div>
                <div className="flex flex-1 flex-col gap-1 text-left">
                  <h2 className="text-base font-semibold text-slate-900">{option.label}</h2>
                  <p className="text-sm text-slate-500">{option.description}</p>
                </div>
                <span className="text-lg text-slate-300">›</span>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Deposits;
