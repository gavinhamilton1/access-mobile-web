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
  IonButton,
  IonIcon,
  IonInput,
  IonList,
  IonItem
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';

// Mock account data
const mockAccounts = {
  'ACCT-0016710022006603': {
    id: 'ACCT-0016710022006603',
    name: 'ACCT-0016710022006603-TITLE.1',
    number: '(...2252)',
    currency: 'BHD',
    currentBalance: '0,00',
    openingBalance: '0,00',
    credits: '0,00',
    debits: '(0,00)',
    isStarred: true
  },
  'ONE-OAKRIDGE-6603': {
    id: 'ONE-OAKRIDGE-6603',
    name: 'ONE OAKRIDGE LLC',
    number: '(...6603)',
    currency: 'USD',
    currentBalance: '1,250.50',
    openingBalance: '1,200.00',
    credits: '150.50',
    debits: '(100.00)',
    isStarred: true
  },
  'RAINBOW-LAKE-7437': {
    id: 'RAINBOW-LAKE-7437',
    name: 'RAINBOW LAKE, LLC',
    number: '(...7437)',
    currency: 'USD',
    currentBalance: '0,00',
    openingBalance: '0,00',
    credits: '0,00',
    debits: '(0,00)',
    isStarred: true
  },
  'RAINBOW-LAKE-9842': {
    id: 'RAINBOW-LAKE-9842',
    name: 'RAINBOW LAKE, LLC',
    number: '(...9842)',
    currency: 'USD',
    currentBalance: '0,00',
    openingBalance: '0,00',
    credits: '0,00',
    debits: '(0,00)',
    isStarred: false
  },
  'GENERIC-USD': {
    id: 'GENERIC-USD',
    name: 'Generic Account',
    number: '(...0000)',
    currency: 'USD',
    currentBalance: '0,00',
    openingBalance: '0,00',
    credits: '0,00',
    debits: '(0,00)',
    isStarred: false
  },
  'JAMES-C-EDWARDS-6085': {
    id: 'JAMES-C-EDWARDS-6085',
    name: 'JAMES C EDWARDS + CO INC',
    number: '(...6085)',
    currency: 'USD',
    currentBalance: '0,00',
    openingBalance: '0,00',
    credits: '0,00',
    debits: '(0,00)',
    isStarred: false
  },
  'KT-2-LLC-6055': {
    id: 'KT-2-LLC-6055',
    name: 'K.T. 2 LLC',
    number: '(...6055)',
    currency: 'USD',
    currentBalance: '0,00',
    openingBalance: '0,00',
    credits: '0,00',
    debits: '(0,00)',
    isStarred: false
  },
  'US-USD-8280': {
    id: 'US-USD-8280',
    name: 'US USD',
    number: '(...8280)',
    currency: 'USD',
    currentBalance: '3 798,02',
    openingBalance: '3 500,00',
    credits: '500,00',
    debits: '(201,98)',
    isStarred: true
  },
  'H-CONSTRUCTION-8478': {
    id: 'H-CONSTRUCTION-8478',
    name: 'H CONSTRUCTION INC',
    number: '(...8478)',
    currency: 'USD',
    currentBalance: '0,00',
    openingBalance: '0,00',
    credits: '0,00',
    debits: '(0,00)',
    isStarred: false
  },
  'FEDERAL-FEE-RECOVERY-9251': {
    id: 'FEDERAL-FEE-RECOVERY-9251',
    name: 'FEDERAL FEE RECOVERY LLC',
    number: '(...9251)',
    currency: 'USD',
    currentBalance: '0,00',
    openingBalance: '0,00',
    credits: '0,00',
    debits: '(0,00)',
    isStarred: false
  },
  'JSN-AAK-ENTERPRISES-0404': {
    id: 'JSN-AAK-ENTERPRISES-0404',
    name: 'JSN-AAK ENTERPRISES',
    number: '(...0404)',
    currency: 'USD',
    currentBalance: '0,00',
    openingBalance: '0,00',
    credits: '0,00',
    debits: '(0,00)',
    isStarred: false
  },
  'ACS-INC-4644': {
    id: 'ACS-INC-4644',
    name: 'ACS INC DBA #1 COMPUTER TROU...',
    number: '(...4644)',
    currency: 'USD',
    currentBalance: '0,00',
    openingBalance: '0,00',
    credits: '0,00',
    debits: '(0,00)',
    isStarred: false
  },
  'ACCT-0019311000891101': {
    id: 'ACCT-0019311000891101',
    name: 'ACCT-0019311000891101-TITLE.1',
    number: '(...1101)',
    currency: 'CAD',
    currentBalance: '763,10',
    openingBalance: '700,00',
    credits: '100,00',
    debits: '(36,90)',
    isStarred: true
  }
};

const AccountDetails: React.FC = () => {
  const history = useHistory();
  const { accountId } = useParams<{ accountId: string }>();
  
  // Load accounts from localStorage or use mock data
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts ? JSON.parse(savedAccounts) : mockAccounts;
  });
  
  // Get account data or use default
  const account = accounts[accountId as keyof typeof accounts] || accounts['ACCT-0016710022006603'];

  const handleBackClick = () => {
    history.push('/accounts');
  };

  const handleStarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedAccounts = {
      ...accounts,
      [accountId]: {
        ...accounts[accountId],
        isStarred: !accounts[accountId].isStarred
      }
    };
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  };

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="account-details-header-layout">
            <div className="back-button-column">
              <IonButton fill="clear" className="back-button" onClick={handleBackClick}>
                <img src="/images/ArrowUp.svg" alt="Back" className="icon-small" style={{transform: 'rotate(-90deg)'}} />
                <span>Back</span>
              </IonButton>
            </div>
            <div className="title-column">
              <IonTitle>{account.name}</IonTitle>
              <IonList>
  <IonItem>
              <IonSelect
                value="Current day"
                interface="popover"
                className="currency-select-inline"
              >
                <IonSelectOption value="Current day">Current day</IonSelectOption>
                <IonSelectOption value="Prior day">Prior day</IonSelectOption>
                <IonSelectOption value="Last week">Last week</IonSelectOption>
              </IonSelect>
              </IonItem>
              </IonList>
            </div>
            <div className="empty-column">
              {/* Empty for balance */}
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          {/* Account Summary Card */}
          <IonCard className="card balance-card">
            <IonCardContent className="card-content">
              <div className="balance-row">
                <div className="balance-label-section">
                  <IonText color="medium">
                    <p className="text-small">Current available</p>
                  </IonText>
                  <IonText>
                    <h2 className="text-large">{account.currency} {account.currentBalance}</h2>
                  </IonText>
                </div>
                <div className="balance-amount-section">
                  <img 
                    src={account.isStarred ? "/images/StarFilled.svg" : "/images/StarBlank.svg"} 
                    alt="Star" 
                    className="icon-small account-star" 
                    onClick={handleStarClick}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div className="balance-divider"></div>

              <div className="balance-row">
                <div className="balance-label-section">
                  <span>Opening balance</span>
                </div>
                <div className="balance-amount-section">
                  <span className="text-bold">{account.openingBalance}</span>
                </div>
              </div>

              <div className="balance-divider"></div>

              <div className="balance-row">
                <div className="balance-label-section">
                  <span>Current balance</span>
                </div>
                <div className="balance-amount-section">
                  <span className="text-bold">{account.currentBalance}</span>
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
                  <span className="text-bold">{account.credits}</span>
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
                  <span className="text-bold">{account.debits}</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Transaction Search Section */}
          <div className="transaction-search-section">
            <div className="search-handle"></div>
            <IonCard className="card search-card">
              <IonCardContent className="card-content">
                <div className="search-container">
                  <img src="/images/Search.svg" alt="Search" className="search-icon" />
                  <IonInput
                    placeholder="Search transactions"
                    className="search-input"
                  />
                  <img src="/images/Filter.svg" alt="Filter" className="filter-icon" />
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AccountDetails;
