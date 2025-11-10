import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonTitle,
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
import StandardHeader from '../components/StandardHeader/StandardHeader';
import PaymentCard from '../components/PaymentCard/PaymentCard';

const mockPayments = {
  approve: [
    { id: 'Analytics03102025.230927', from: 'From (..8488)', type: 'Book transfer', amount: 'USD 101,00', status: 'Expired value date', cutOffDate: '10/04/25' },
    { id: 'Analytics05102025.194102', from: 'From (..8488)', type: 'Book transfer', amount: 'USD 101,00', status: 'Expired value date', cutOffDate: '10/05/25' },
    { id: 'Analytics06102025.193816', from: 'From (..8488)', type: 'Wire', amount: 'USD 10,00', status: 'Expired value date', cutOffDate: '10/06/25' },
    { id: 'Analytics07102025.193545', from: 'From (..8488)', type: 'Wire', amount: 'USD 10,00', status: 'Expired value date', cutOffDate: '10/07/25' },
  ],
  release: [
    { id: 'Analytics01102025.194659', from: 'From (..8488)', type: 'Wire', amount: 'USD 1,12', status: 'Expired value date', cutOffDate: '10/01/25' },
    { id: 'Analytics01102025.193752', from: 'From (..8488)', type: 'Wire', amount: 'USD 1,12', status: 'Expired value date', cutOffDate: '10/01/25' },
    { id: 'CSWIREAPI', from: 'From (..8488)', type: 'Wire', amount: 'USD 1,12', status: 'Expired value date', cutOffDate: '10/01/25' },
    { id: 'CSAutoACH Credit4792', from: 'From (..8280)', type: 'ACH Credit', amount: 'USD 20,01', status: 'Expired value date', cutOffDate: '10/02/25' },
    { id: 'CSITCAPI', from: 'From (..8280)', type: 'ACH Credit', amount: 'USD 100,01', status: 'Expired value date', cutOffDate: '10/02/25' },
  ],
};

const Payments: React.FC = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<'approve' | 'release'>('approve');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const getPaymentsByCutOffDate = (payments: any[]) => {
    return payments.reduce((acc, payment) => {
      const date = payment.cutOffDate;
      if (!acc[date]) acc[date] = [];
      acc[date].push(payment);
      return acc;
    }, {});
  };

  const currentPayments = activeTab === 'approve' ? mockPayments.approve : mockPayments.release;
  const groupedPayments = getPaymentsByCutOffDate(currentPayments);

  const handleSelectToggle = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) setSelectedItems(new Set());
  };

  const handleItemSelect = (paymentId: string) => {
    const newSelected = new Set(selectedItems);
    newSelected.has(paymentId) ? newSelected.delete(paymentId) : newSelected.add(paymentId);
    setSelectedItems(newSelected);
  };

  const handleActionClick = (actionType: 'approve' | 'release') => {
    const selectedPaymentItems = currentPayments.filter(p => selectedItems.has(p.id));
    history.push('/approve-release', { selectedItems: selectedPaymentItems, actionType });
  };

  return (
    <IonPage>
      <StandardHeader
        left={
          <IonButton fill="clear" className="header-button" onClick={handleSelectToggle}>
            <IonText>{isSelectMode ? 'Cancel' : 'Select'}</IonText>
          </IonButton>
        }
        center={<IonTitle>Pending payments</IonTitle>}
        right={
          <IonButton fill="clear" className="header-button">
            <IonText>History</IonText>
          </IonButton>
        }
      />
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
                  <PaymentCard
                    key={paymentIndex}
                    payment={payment}
                    isSelectMode={isSelectMode}
                    isSelected={selectedItems.has(payment.id)}
                    onSelect={handleItemSelect}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </main>
      {selectedItems.size > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-around">
          <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full w-1/2 mr-2">
            Reject ({selectedItems.size})
          </button>
          <button
            onClick={() => handleActionClick(activeTab)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full w-1/2 ml-2"
          >
            {activeTab === 'approve' ? 'Approve' : 'Release'} ({selectedItems.size})
          </button>
        </footer>
      )}
    </div>
  );
};

export default Payments;
