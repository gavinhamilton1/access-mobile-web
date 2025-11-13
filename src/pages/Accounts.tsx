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
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { accountsData } from '../data/accountsData';

type Account = (typeof accountsData)[keyof typeof accountsData];

const mockAccounts: Record<string, Account> = accountsData;

const Accounts: React.FC = () => {
  const history = useHistory();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [accounts, setAccounts] = useState<Record<string, Account>>(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts ? JSON.parse(savedAccounts) : mockAccounts;
  });
  const [sortedAccounts, setSortedAccounts] = useState<Account[]>([]);

  React.useEffect(() => {
    const sorted = Object.values(accounts).sort((a, b) => {
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    setSortedAccounts(sorted);
  }, [accounts, sortOrder]);

  const handleAccountClick = (accountId: string) => {
    history.push(`/accounts/account-details/${accountId}`);
  };

  const handleSortClick = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    const sorted = Object.values(accounts).sort((a: Account, b: Account) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return newSortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    setSortedAccounts(sorted);
  };

  const handleStarClick = (accountId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedAccounts = {
      ...accounts,
      [accountId]: {
        ...accounts[accountId],
        isStarred: !accounts[accountId].isStarred,
      },
    };
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setSortedAccounts(prevSorted =>
      prevSorted.map(account =>
        account.id === accountId
          ? { ...account, isStarred: !account.isStarred }
          : account
      )
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="px-4">
          <div className="flex w-full items-center justify-between gap-4 py-2">
            <div className="flex min-w-[64px] justify-start" />
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              <IonTitle className="text-base font-semibold text-slate-800">
                Accounts
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
            <div className="flex min-w-[64px] justify-end">
              <img
                src={sortOrder === 'asc' ? '/images/SortDown.svg' : '/images/SortUp.svg'}
                alt="Sort"
                className="h-6 w-6 cursor-pointer"
                onClick={handleSortClick}
              />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="space-y-6 bg-slate-100 p-4 pb-16">
          <IonCard className="rounded-2xl border border-slate-200 shadow-sm">
            <IonCardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <IonText color="medium">
                    <p className="text-sm font-medium text-slate-500">Current available</p>
                  </IonText>
                  <IonText>
                    <h2 className="text-3xl font-semibold text-slate-900">
                      1 063 261<span className="text-lg text-slate-500">,52</span>
                    </h2>
                  </IonText>
                </div>
                <IonSelect
                  value="USD"
                  interface="popover"
                  className="rounded-full border border-slate-200 px-4 py-1 text-sm font-medium text-slate-600"
                >
                  <IonSelectOption value="USD">USD</IonSelectOption>
                  <IonSelectOption value="EUR">EUR</IonSelectOption>
                  <IonSelectOption value="GBP">GBP</IonSelectOption>
                </IonSelect>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm text-slate-600">
                <span>Opening balance</span>
                <span className="font-semibold text-slate-800">1 063 261,52</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm text-slate-600">
                <span>Current balance</span>
                <span className="font-semibold text-slate-800">1 063 261,52</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <img src="/images/PiggyBank.svg" alt="Credits" className="h-5 w-5" />
                  <span>Credits</span>
                </div>
                <span className="font-semibold text-slate-800">0,00</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <img src="/images/VisibilityOn.svg" alt="Debits" className="h-5 w-5" />
                  <span>Debits</span>
                </div>
                <span className="font-semibold text-slate-800">(0,00)</span>
              </div>
            </IonCardContent>
          </IonCard>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Accounts</h3>
              <span className="text-sm text-slate-500">{sortedAccounts.length} total</span>
            </div>
            <div className="space-y-3">
              {sortedAccounts.map((account: Account) => (
                <IonCard
                  key={account.id}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-primary hover:shadow-md"
                  onClick={() => handleAccountClick(account.id)}
                >
                  <IonCardContent className="flex items-center gap-4 p-4">
                    <button
                      type="button"
                      onClick={e => handleStarClick(account.id, e)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:border-teal-primary"
                    >
                      <img
                        src={account.isStarred ? '/images/StarFilled.svg' : '/images/StarBlank.svg'}
                        alt="Star account"
                        className="h-5 w-5"
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-slate-900">
                        {account.name}
                        <span className="ml-2 text-sm font-medium text-slate-500">
                          {account.number}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {account.currency} {account.currentBalance}
                      </p>
                    </div>
                    <img src="/images/ArrowForward.svg" alt="Go to account" className="h-5 w-5" />
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Accounts;