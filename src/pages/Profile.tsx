import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Profile: React.FC = () => {
  const history = useHistory();

  const navigationOptions = [
    { label: 'Settings', icon: '/images/Settings.svg', action: () => console.log('Navigate to Settings') },
    { label: 'Support', icon: '/images/Phone.svg', action: () => console.log('Navigate to Support') },
    { label: 'Notifications', icon: '/images/Alert.svg', action: () => console.log('Navigate to Notifications') },
    { label: 'App Experience', icon: '/images/Apps.svg', action: () => history.push('/app-experience') },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="px-4">
          <div className="flex items-center justify-between py-2">
            <div className="min-w-[64px]" />
            <IonTitle className="text-base font-semibold text-slate-800">Profile</IonTitle>
            <div className="min-w-[64px]" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="space-y-8 bg-slate-100 p-4 pb-16">
          <IonCard className="rounded-2xl border border-slate-200 shadow-sm">
            <IonCardContent className="flex items-center gap-3 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                <img src="/images/Profile.svg" alt="User" className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">test mobile</p>
                <p className="text-xs text-slate-500">Corporate banking</p>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="space-y-3">
            {navigationOptions.map(option => (
              <IonCard
                key={option.label}
                button
                onClick={option.action}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-primary hover:shadow-md"
              >
                <IonCardContent className="flex items-center gap-3 p-4">
                  <img src={option.icon} alt="" className="h-5 w-5" />
                  <span className="flex-1 text-sm font-semibold text-slate-900">{option.label}</span>
                  <img src="/images/ArrowForward.svg" alt="Go" className="h-5 w-5" />
                </IonCardContent>
              </IonCard>
            ))}
          </div>

          <div className="text-center text-xs text-slate-400">
            Last login · 24-Oct-25 at 9:41 PM
          </div>

          <div className="flex flex-col gap-3">
            <IonButton
              fill="outline"
              className="rounded-full border border-teal-primary py-3 text-sm font-semibold text-teal-primary"
              onClick={() => console.log('Give feedback')}
            >
              Give feedback
            </IonButton>
            <IonButton
              className="rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow"
              onClick={() => console.log('Log out')}
            >
              Log out
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
