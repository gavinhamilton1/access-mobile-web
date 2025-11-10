import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonTitle,
  IonCard,
  IonCardContent,
  IonText,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonIcon,
  IonChip,
  IonList
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import StandardHeader from '../components/StandardHeader/StandardHeader';
import BalanceCard from '../components/BalanceCard/BalanceCard';
import AccountCard from '../components/AccountCard/AccountCard';
import { accountsData } from '../data/accountsData';

const mockAccounts = accountsData;

const Accounts: React.FC = () => {
  const history = useHistory();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts ? JSON.parse(savedAccounts) : mockAccounts;
  });

  const [sortedAccounts, setSortedAccounts] = useState<any[]>([]);

  useEffect(() => {
    const sorted = Object.values(accounts).sort((a: any, b: any) => {
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setSortedAccounts(sorted);
  }, [accounts, sortOrder]);

  const handleAccountClick = (accountId: string) => {
    history.push(`/accounts/account-details/${accountId}`);
  };

  const handleSortClick = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
  };

  return (
    <IonPage>
      <StandardHeader
        left={<div />}
        center={
          <>
            <IonTitle>Accounts</IonTitle>
            <IonSelect
              value="Current day"
              interface="popover"
              className="currency-select-inline"
            >
              <IonSelectOption value="Current day">Current day</IonSelectOption>
              <IonSelectOption value="Prior day">Prior day</IonSelectOption>
              <IonSelectOption value="Last week">Last week</IonSelectOption>
            </IonSelect>
          </>
        }
        right={
          <img
            src={sortOrder === 'asc' ? "/images/SortDown.svg" : "/images/SortUp.svg"}
            alt="Sort"
            className="icon-medium"
            onClick={handleSortClick}
            style={{ cursor: 'pointer' }}
          />
        }
      />
      <IonContent fullscreen>
        <div className="page-content">
          <BalanceCard />
        {/* Accounts Section */}
        <div className="accounts-section">
          <h3 className="section-title">Accounts</h3>
          
          {sortedAccounts.map((account: any) => (
            <AccountCard
              key={account.id}
              account={account}
              onClick={handleAccountClick}
              onStarClick={handleStarClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Accounts;