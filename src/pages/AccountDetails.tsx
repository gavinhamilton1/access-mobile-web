import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonText,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { accountsData } from '../data/accountsData';

type Account = (typeof accountsData)[keyof typeof accountsData];

const AccountDetails: React.FC = () => {
  const history = useHistory();
  const { accountId } = useParams<{ accountId: string }>();

  const [accounts, setAccounts] = useState<Record<string, Account>>(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts ? JSON.parse(savedAccounts) : accountsData;
  });

  const currentAccount = accounts[accountId] ?? accounts['ACCT-0016710022006603'];

  const handleBackClick = () => {
    history.goBack();
  };

  const handleStarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedAccounts = {
      ...accounts,
      [currentAccount.id]: {
        ...currentAccount,
        isStarred: !currentAccount.isStarred,
      },
    };
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="px-4">
          <div className="flex items-center justify-between gap-4 py-2">
            <IonButton
              fill="clear"
              className="flex items-center gap-2 text-sm font-semibold text-slate-600"
              onClick={handleBackClick}
            >
              <img src="/images/ArrowUp.svg" alt="Back" className="h-4 w-4 -rotate-90" />
              <span>Back</span>
            </IonButton>
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              <IonTitle className="text-base font-semibold text-slate-800">
                <span className="line-clamp-1">{currentAccount.name}</span>
              </IonTitle>
              <IonSelect
                value="Current day"
                interface="popover"
                className="rounded-full border border-slate-200 px-4 py-1 text-sm font-medium text-slate-600"
              >
                <IonSelectOption value="Current day">Current day</IonSelectOption>
                <IonSelectOption value="Prior day">Prior day</IonSelectOption>
                <IonSelectOption value="Last week">Last week</IonSelectOption>
              </IonSelect>
            </div>
            <div className="flex min-w-[64px] justify-end" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="space-y-6 bg-slate-100 p-4 pb-24">
          <IonCard className="rounded-2xl border border-slate-200 shadow-sm">
            <IonCardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <IonText color="medium">
                    <p className="text-sm font-medium text-slate-500">Current available</p>
                  </IonText>
                  <IonText>
                    <h2 className="text-3xl font-semibold text-slate-900">
                      {currentAccount.currency} {currentAccount.currentBalance}
                    </h2>
                  </IonText>
                  <p className="text-sm font-medium text-slate-500">{currentAccount.number}</p>
                </div>
                <button
                  type="button"
                  onClick={handleStarClick}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:border-teal-primary"
                >
                  <img
                    src={currentAccount.isStarred ? '/images/StarFilled.svg' : '/images/StarBlank.svg'}
                    alt="Toggle favorite"
                    className="h-5 w-5"
                  />
                </button>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-3 text-sm text-slate-600">
                {[{
                  label: 'Opening balance',
                  value: currentAccount.openingBalance,
                }, {
                  label: 'Current balance',
                  value: currentAccount.currentBalance,
                }, {
                  label: 'Credits',
                  value: currentAccount.credits,
                  icon: '/images/PiggyBank.svg',
                }, {
                  label: 'Debits',
                  value: currentAccount.debits,
                  icon: '/images/VisibilityOn.svg',
                }].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {icon && <img src={icon} alt={label} className="h-5 w-5" />}
                      <span>{label}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Transactions</h3>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                Export CSV
              </button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <img src="/images/Search.svg" alt="Search" className="h-5 w-5 opacity-60" />
                <IonInput
                  placeholder="Search transactions"
                  className="text-sm text-slate-700"
                />
                <img src="/images/Filter.svg" alt="Filter" className="h-5 w-5 opacity-80" />
              </div>
              <p className="mt-3 text-xs text-slate-500">Recent activity will appear here once transactions are available.</p>
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AccountDetails;
