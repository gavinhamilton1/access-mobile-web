import React, { useState, useMemo } from 'react';
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
  IonItem,
  IonLabel,
  IonIcon,
  IonChip,
  IonList
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
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

      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="header-content">
            <div className="header-left">
            </div>
            <div className="header-center">
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
            </div>
            <div className="header-right">
              <img 
                src={sortOrder === 'asc' ? "/images/SortDown.svg" : "/images/SortUp.svg"} 
                alt="Sort" 
                className="icon-medium" 
                onClick={handleSortClick}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>



      <IonContent fullscreen>
        <div className="page-content">
          {/* Current Available Balance Card */}
        <IonCard className="card balance-card">
          <IonCardContent className="card-content">
            <div className="balance-row">
              <div className="balance-label-section">
                <IonText color="medium">
                  <p className="text-small">Current available</p>
                </IonText>
                <IonText>
                  <h2 className="text-large">1 063 261<span className="decimal-part">,52</span></h2>
                </IonText>
              </div>
              <div className="balance-amount-section">
                <IonSelect
                  value="USD"
                  interface="popover"
                  className="currency-select-inline"
                >
                  <IonSelectOption value="USD">USD</IonSelectOption>
                  <IonSelectOption value="EUR">EUR</IonSelectOption>
                  <IonSelectOption value="GBP">GBP</IonSelectOption>
                </IonSelect>
              </div>
            </div>

            <div className="balance-divider"></div>

            <div className="balance-row">
              <div className="balance-label-section">
                <span>Opening balance</span>
              </div>
              <div className="balance-amount-section">
                <span className="text-bold">1 063 261,52</span>
              </div>
            </div>

            <div className="balance-divider"></div>

            <div className="balance-row">
              <div className="balance-label-section">
                <span>Current balance</span>
              </div>
              <div className="balance-amount-section">
                <span className="text-bold">1 063 261,52</span>
              </div>
            </div>

            <div className="balance-divider"></div>

            <div className="balance-row">
              <div className="balance-label-section">
                <div className="credit-debit-left">
                  <img src="/images/PiggyBank.svg" alt="Credits" className="icon-small" />
                  <span>Credits</span>
                </div>
              </div>
              <div className="balance-amount-section">
                <span className="text-bold">0,00</span>
              </div>
            </div>

            <div className="balance-divider"></div>

            <div className="balance-row">
              <div className="balance-label-section">
                <div className="credit-debit-left">
                  <img src="/images/VisibilityOn.svg" alt="Debits" className="icon-small" />
                  <span>Debits</span>
                </div>
              </div>
              <div className="balance-amount-section">
                <span className="text-bold">(0,00)</span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Accounts Section */}
        <div className="accounts-section">
          <h3 className="section-title">Accounts</h3>
          
          {sortedAccounts.map((account: any) => (
            <IonCard key={account.id} className="card" onClick={() => handleAccountClick(account.id)}>
              <IonCardContent className="card-content">
                <div className="account-item">
                  <img 
                    src={account.isStarred ? "/images/StarFilled.svg" : "/images/StarBlank.svg"} 
                    alt="Star" 
                    className="icon-small account-star" 
                    onClick={(e) => handleStarClick(account.id, e)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="account-details">
                    <h3>{account.name}<span className="account-number">{account.number}</span></h3>
                    <p className="account-balance">{account.currency} {account.currentBalance}</p>
                  </div>
                  <img src="/images/ArrowForward.svg" alt="Chevron" className="icon-small" />
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Accounts;