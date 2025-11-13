import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

type CaptureHistoryItem = {
  id: string;
  title: string;
  programNumber: string;
  amount: string;
  currency: string;
  status: 'action-required' | 'deposited';
  date: string;
};

const mockHistoryData: CaptureHistoryItem[] = [
  {
    id: '1',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '3 000 000,00',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '100 000,00',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-15',
  },
  {
    id: '3',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '25,00',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-15',
  },
  {
    id: '4',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '50,00',
    currency: 'USD',
    status: 'deposited',
    date: '2024-01-14',
  },
  {
    id: '5',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '75,00',
    currency: 'USD',
    status: 'deposited',
    date: '2024-01-14',
  },
  {
    id: '6',
    title: 'CAD PROGRAM CA/USD',
    programNumber: 'Program 931503602',
    amount: '80,12',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-13',
  },
  {
    id: '7',
    title: 'CAD PROGRAM CA/CAD',
    programNumber: 'Program 931503601',
    amount: '10,11',
    currency: 'CAD',
    status: 'action-required',
    date: '2024-01-13',
  },
  {
    id: '8',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '125,00',
    currency: 'USD',
    status: 'deposited',
    date: '2024-01-12',
  },
];

const CaptureHistory: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');

  const filteredData = mockHistoryData.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.programNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBack = () => history.goBack();

  const statusStyles: Record<CaptureHistoryItem['status'], { label: string; badge: string; icon: string }> = {
    'action-required': {
      label: 'Action Required',
      badge: 'text-amber-600 bg-amber-100',
      icon: '/images/Warning.svg',
    },
    deposited: {
      label: 'Deposited',
      badge: 'text-emerald-600 bg-emerald-100',
      icon: '/images/Check.svg',
    },
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
            <IonTitle className="text-base font-semibold text-slate-800">Capture history</IonTitle>
            <div className="min-w-[64px]" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="space-y-5 bg-slate-100 p-4 pb-10">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <img src="/images/Search.svg" alt="Search" className="h-5 w-5 opacity-60" />
            <IonInput
              placeholder="Search history"
              value={searchText}
              onIonInput={e => setSearchText(e.detail.value ?? '')}
              className="text-sm text-slate-700"
            />
          </div>

          <div className="space-y-3">
            {filteredData.map(item => {
              const status = statusStyles[item.status];
              return (
                <IonCard
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-primary hover:shadow-md"
                >
                  <IonCardContent className="flex flex-col gap-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <IonText>
                          <h3 className="truncate text-base font-semibold text-slate-900">{item.title}</h3>
                        </IonText>
                        <p className="text-sm text-slate-500">{item.programNumber}</p>
                      </div>
                      <div className="text-right text-sm font-semibold text-slate-900">
                        {item.currency} {item.amount}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{item.date}</span>
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}>
                        <img src={status.icon} alt={status.label} className="h-4 w-4" />
                        {status.label}
                      </span>
                    </div>
                  </IonCardContent>
                </IonCard>
              );
            })}

            {filteredData.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                No capture history matches your search.
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CaptureHistory;
