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

type DailySummaryItem = {
  id: string;
  date: string;
  depositsCount: number;
  totalValue: string;
};

const mockDailyData: DailySummaryItem[] = [
  { id: '1', date: '10/15/25', depositsCount: 0, totalValue: '$0,00' },
  { id: '2', date: '10/14/25', depositsCount: 0, totalValue: '$0,00' },
  { id: '3', date: '10/13/25', depositsCount: 1, totalValue: '$10,11' },
  { id: '4', date: '10/12/25', depositsCount: 0, totalValue: '$0,00' },
  { id: '5', date: '10/11/25', depositsCount: 2, totalValue: '$388,12' },
  { id: '6', date: '10/10/25', depositsCount: 1, totalValue: '$2,00' },
  { id: '7', date: '10/09/25', depositsCount: 0, totalValue: '$0,00' },
  { id: '8', date: '10/08/25', depositsCount: 0, totalValue: '$0,00' },
  { id: '9', date: '10/07/25', depositsCount: 0, totalValue: '$0,00' },
];

const DailySummary: React.FC = () => {
  const history = useHistory();

  const handleBack = () => history.goBack();
  const handleDayClick = (item: DailySummaryItem) => {
    console.log('Navigate to day details:', item.date);
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
            <IonTitle className="text-base font-semibold text-slate-800">Daily summary</IonTitle>
            <div className="min-w-[64px]" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="space-y-3 bg-slate-100 p-4 pb-10">
          {mockDailyData.map(item => (
            <IonCard
              key={item.id}
              button
              onClick={() => handleDayClick(item)}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-primary hover:shadow-md"
            >
              <IonCardContent className="flex items-center justify-between gap-6 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Deposits</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{item.depositsCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Total value</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{item.totalValue}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Date</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{item.date}</p>
                  </div>
                  <img src="/images/ArrowForward.svg" alt="View" className="h-5 w-5 text-slate-300" />
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DailySummary;
