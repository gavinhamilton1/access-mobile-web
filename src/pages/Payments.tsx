import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonInput,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonText,
  IonButton
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

// Mock payment data
const mockPayments = {
  approve: [
    {
      id: 'Analytics03102025.230927',
      from: 'From (..8488)',
      type: 'Book transfer',
      amount: 'USD 101,00',
      status: 'Expired value date',
      cutOffDate: '10/04/25'
    },
    {
      id: 'Analytics05102025.194102',
      from: 'From (..8488)',
      type: 'Book transfer',
      amount: 'USD 101,00',
      status: 'Expired value date',
      cutOffDate: '10/05/25'
    },
    {
      id: 'Analytics06102025.193816',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 10,00',
      status: 'Expired value date',
      cutOffDate: '10/06/25'
    },
    {
      id: 'Analytics07102025.193545',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 10,00',
      status: 'Expired value date',
      cutOffDate: '10/07/25'
    }
  ],
  release: [
    {
      id: 'Analytics01102025.194659',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 1,12',
      status: 'Expired value date',
      cutOffDate: '10/01/25'
    },
    {
      id: 'Analytics01102025.193752',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 1,12',
      status: 'Expired value date',
      cutOffDate: '10/01/25'
    },
    {
      id: 'CSWIREAPI',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 1,12',
      status: 'Expired value date',
      cutOffDate: '10/01/25'
    },
    {
      id: 'CSAutoACH Credit4792',
      from: 'From (..8280)',
      type: 'ACH Credit',
      amount: 'USD 20,01',
      status: 'Expired value date',
      cutOffDate: '10/02/25'
    },
    {
      id: 'CSITCAPI',
      from: 'From (..8280)',
      type: 'ACH Credit',
      amount: 'USD 100,01',
      status: 'Expired value date',
      cutOffDate: '10/02/25'
    }
  ]
};

const Payments: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'approve' | 'release'>('approve');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const getPaymentsByCutOffDate = (payments: any[]) => {
    const grouped = payments.reduce((acc, payment) => {
      if (!acc[payment.cutOffDate]) {
        acc[payment.cutOffDate] = [];
      }
      acc[payment.cutOffDate].push(payment);
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, payments]) => ({
      date,
      payments: payments as any[]
    }));
  };

  const currentPayments = activeTab === 'approve' ? mockPayments.approve : mockPayments.release;
  const groupedPayments = getPaymentsByCutOffDate(currentPayments);

  const handleSelectToggle = () => {
    if (isSelectMode) {
      // Cancel: exit select mode and clear selections
      setIsSelectMode(false);
      setSelectedItems(new Set());
    } else {
      // Enter select mode
      setIsSelectMode(true);
    }
  };

  const handleItemSelect = (paymentId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(paymentId)) {
      newSelected.delete(paymentId);
    } else {
      newSelected.add(paymentId);
    }
    setSelectedItems(newSelected);
  };

  const getSelectedPaymentItems = () => {
    const currentPayments = activeTab === 'approve' ? mockPayments.approve : mockPayments.release;
    return currentPayments.filter(payment => selectedItems.has(payment.id));
  };

  const handleActionClick = (actionType: 'approve' | 'release') => {
    const selectedPaymentItems = getSelectedPaymentItems();
    
    // Cancel selection mode before navigating
    setIsSelectMode(false);
    setSelectedItems(new Set());
    
    history.push('/approve-release', {
      selectedItems: selectedPaymentItems,
      actionType: actionType
    });
  };

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="payments-header-layout">
            <div className="header-left">
            <IonButton fill="clear" className="header-button" onClick={handleSelectToggle}>
                <IonText>{isSelectMode ? 'Cancel' : 'Select'}</IonText>
              </IonButton>
            </div>
            <div className="header-center">
              <IonTitle>Pending payments</IonTitle>
            </div>
            <div className="header-right">
              <IonButton fill="clear" className="header-button">
                <IonText>History</IonText>
              </IonButton>
            </div>
          </div>
        </IonToolbar>
                {/* Search Section in header */}
                <div className="payments-search-header">
                  <div className="search-wrapper">
                    <div className="search-container">
                      <img src="/images/Search.svg" alt="Search" className="search-icon" />
                      <IonInput
                        placeholder={activeTab === 'approve' ? "Search approvals" : "Search releases"}
                        className="search-input"
                      />
                    </div>
                    <IonButton fill="clear" className="filter-button">
                      <img src="/images/Filter.svg" alt="Filter" className="filter-icon" />
                    </IonButton>
                  </div>
                </div>
        {/* Tabs in header */}
        <div className="payments-tabs-header">
          <IonSegment 
            value={activeTab} 
            onIonChange={e => {
              // Cancel selection mode when switching tabs
              if (isSelectMode) {
                setIsSelectMode(false);
                setSelectedItems(new Set());
              }
              setActiveTab(e.detail.value as 'approve' | 'release');
            }}
            className="payments-segment"
          >
            <IonSegmentButton value="approve" className="payment-tab">
              <IonLabel>Approve</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="release" className="payment-tab">
              <IonLabel>Release</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
        

      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">


          {/* Payment List */}
          <div className="payments-list">
            {groupedPayments.map((group, groupIndex) => (
              <div key={groupIndex} className="payment-group">
                <div className="cutoff-date-header">
                  <IonText color="medium">
                    <p className="cutoff-date-text">Cut-off date {group.date}</p>
                  </IonText>
                </div>
                
                {group.payments.map((payment, paymentIndex) => (
                  <IonCard 
                    key={paymentIndex} 
                    className={`card payment-card ${isSelectMode ? 'selectable-card' : ''}`}
                    onClick={isSelectMode ? () => handleItemSelect(payment.id) : undefined}
                  >
                    <IonCardContent className="card-content">
                      <div className="payment-item">
                        {isSelectMode && (
                          <div className="payment-select">
                            <input 
                              type="checkbox"
                              checked={selectedItems.has(payment.id)}
                              onChange={() => handleItemSelect(payment.id)}
                              className="payment-radio"
                            />
                          </div>
                        )}
                        <div className="payment-details">
                          <div className="payment-left">
                            <IonText>
                              <h3 className="payment-id">{payment.id}</h3>
                            </IonText>
                            <IonText color="medium">
                              <p className="payment-from">{payment.from}</p>
                            </IonText>
                          </div>
                          
                          <div className="payment-right">
                            <div className="payment-type-section">
                              <IonText color="medium">
                                <p className="payment-type">{payment.type} <img src="/images/ArrowForward.svg" alt="Arrow" className="icon-small" /></p>
                              </IonText>
                              <IonText>
                                <p className="payment-amount">{payment.amount}</p>
                              </IonText>
                            </div>
                            
                            <div className="payment-status">
                              <img src="/images/Warning.svg" alt="Warning" className="warning-icon" />
                              <IonText color="warning">
                                <p className="status-text">{payment.status}</p>
                              </IonText>
                            </div>
                          </div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            ))}
          </div>
        </div>
      </IonContent>
      
      {/* Action Buttons - Only show when items are selected */}
      {selectedItems.size > 0 && (
        <div className="action-buttons-container">
          <IonButton 
            fill="outline" 
            className="action-button reject-button"
            onClick={() => console.log('Reject selected items')}
          >
            Reject ({selectedItems.size})
          </IonButton>
          <IonButton 
            fill="solid" 
            className="action-button primary-button"
            onClick={() => handleActionClick(activeTab)}
          >
            {activeTab === 'approve' ? 'Approve' : 'Release'} ({selectedItems.size})
          </IonButton>
        </div>
      )}
    </IonPage>
  );
};

export default Payments;
