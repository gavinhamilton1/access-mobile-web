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

// Note: accountsData is now available globally for use in other pages
// Mock account data (same as AccountDetails)
const mockAccounts = accountsData

const Accounts: React.FC = () => {
  const history = useHistory();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Load accounts from localStorage or use mock data
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts ? JSON.parse(savedAccounts) : mockAccounts;
  });

  // Maintain sorted accounts array separately
  const [sortedAccounts, setSortedAccounts] = useState<any[]>([]);

  // Initialize sorted accounts on first load - favorites first, then alphabetical
  React.useEffect(() => {
    const sorted = Object.values(accounts).sort((a: any, b: any) => {
      // First sort by starred status (starred first)
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;
      
      // Then sort by name
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    setSortedAccounts(sorted);
  }, []); // Only run once on mount

  const handleAccountClick = (accountId: string) => {
    // Navigate to account details page using React Router
    history.push(`/accounts/account-details/${accountId}`);
  };

  const handleSortClick = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    
    // Re-sort the accounts with the new sort order (alphabetical only)
    const sorted = Object.values(accounts).sort((a: any, b: any) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (newSortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    setSortedAccounts(sorted);
  };

  const handleStarClick = (accountId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent account card click
    const updatedAccounts = {
      ...accounts,
      [accountId]: {
        ...accounts[accountId],
        isStarred: !accounts[accountId].isStarred
      }
    };
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    
    // Update only the star state in sorted accounts without re-sorting
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Accounts;