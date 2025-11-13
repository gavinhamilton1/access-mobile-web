import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonText,
  IonButton
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Tab1: React.FC = () => {
  const history = useHistory();

  const handleCaptureDeposit = () => {
    history.push('/deposit-to');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="px-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <IonText color="medium">
                <p className="text-sm font-medium text-slate-500">Welcome, test.</p>
              </IonText>
            </div>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white">
              <img src="/images/Alert.svg" alt="Alerts" className="h-5 w-5" />
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="space-y-6 bg-slate-100 p-4 pb-28">
          <IonCard className="rounded-2xl border border-slate-200 shadow-sm">
            <IonCardContent className="flex flex-col gap-4 p-4">
              {[
                { label: 'Current day', value: '1 063 261', suffix: ',52', showSelect: true },
                { label: 'Prior day', value: '1 063 261', suffix: ',52', showSelect: false },
              ].map(({ label, value, suffix, showSelect }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <IonText color="medium">
                      <p className="text-sm font-medium text-slate-500">{label}</p>
                    </IonText>
                    <IonText>
                      <h2 className="text-3xl font-semibold text-slate-900">
                        {value}
                        <span className="text-lg text-slate-500">{suffix}</span>
                      </h2>
                    </IonText>
                  </div>
                  {showSelect ? (
                    <IonSelect
                      value="USD"
                      interface="popover"
                      className="rounded-full border border-slate-200 px-4 py-1 text-sm font-medium text-slate-600"
                    >
                      <IonSelectOption value="USD">USD</IonSelectOption>
                      <IonSelectOption value="EUR">EUR</IonSelectOption>
                      <IonSelectOption value="GBP">GBP</IonSelectOption>
                    </IonSelect>
                  ) : (
                    <div className="h-7" />
                  )}
                </div>
              ))}

              <div className="space-y-3 border-t border-slate-100 pt-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/images/PiggyBank.svg" alt="Credits" className="h-5 w-5" />
                    <span>Credits</span>
                  </div>
                  <span className="font-semibold text-slate-800">0,00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/images/VisibilityOn.svg" alt="Debits" className="h-5 w-5" />
                    <span>Debits</span>
                  </div>
                  <span className="font-semibold text-slate-800">(0,00)</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="rounded-2xl border border-slate-200 shadow-sm">
            <IonCardContent className="flex flex-col divide-y divide-slate-100 p-4">
              {[
                { icon: '/images/Check.svg', label: 'Approve payment' },
                { icon: '/images/ListCheck.svg', label: 'Release payment' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <img src={item.icon} alt={item.label} className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-teal-primary" />
                </div>
              ))}
            </IonCardContent>
          </IonCard>

          <IonCard className="rounded-2xl border border-slate-200 shadow-sm">
            <IonCardContent className="space-y-4 p-4">
              <h3 className="text-base font-semibold text-slate-900">File Transmissions</h3>
              <div className="space-y-3">
                {[
                  {
                    icon: '/images/CircleCheck.svg',
                    label: 'Sent for processing',
                    value: '55',
                    badgeClass: 'bg-teal-100 text-teal-700',
                  },
                  {
                    icon: '/images/CircleInfo.svg',
                    label: 'In process',
                    value: '648',
                    badgeClass: 'bg-blue-100 text-blue-700',
                  },
                  {
                    icon: '/images/CircleCross.svg',
                    label: 'Failed',
                    value: '7',
                    badgeClass: 'bg-rose-100 text-rose-700',
                  },
                ].map(status => (
                  <div key={status.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <img src={status.icon} alt={status.label} className="h-5 w-5" />
                      <span>{status.label}</span>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.badgeClass}`}>{status.value}</span>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <div className="fixed inset-x-4 bottom-6 z-40">
          <IonButton
            expand="block"
            className="flex items-center justify-center gap-2 rounded-full bg-teal-primary py-3 text-sm font-semibold text-white shadow-lg"
            onClick={handleCaptureDeposit}
          >
            <img src="/images/Camera.svg" alt="Camera" className="h-5 w-5" />
            Capture deposit
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
