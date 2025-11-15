import React, { useMemo, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import {
  ArrowForward,
  Filter,
  ListCheck,
  Search,
} from '../components/icons';
import './home.css';

const mockPayments = {
  approve: [
    {
      id: 'Analytics03102025.230927',
      from: 'From (..8488)',
      type: 'Book transfer',
      amount: 'USD 101,00',
      status: 'Expired value date',
      cutOffDate: '10/04/25',
    },
    {
      id: 'Analytics05102025.194102',
      from: 'From (..8488)',
      type: 'Book transfer',
      amount: 'USD 101,00',
      status: 'Expired value date',
      cutOffDate: '10/05/25',
    },
    {
      id: 'Analytics06102025.193816',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 10,00',
      status: 'Expired value date',
      cutOffDate: '10/06/25',
    },
    {
      id: 'Analytics07102025.193545',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 10,00',
      status: 'Expired value date',
      cutOffDate: '10/07/25',
    },
  ],
  release: [
    {
      id: 'Analytics01102025.194659',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 1,12',
      status: 'Expired value date',
      cutOffDate: '10/01/25',
    },
    {
      id: 'Analytics01102025.193752',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 1,12',
      status: 'Expired value date',
      cutOffDate: '10/01/25',
    },
    {
      id: 'CSWIREAPI',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 1,12',
      status: 'Expired value date',
      cutOffDate: '10/01/25',
    },
    {
      id: 'CSAutoACH Credit4792',
      from: 'From (..8280)',
      type: 'ACH Credit',
      amount: 'USD 20,01',
      status: 'Expired value date',
      cutOffDate: '10/02/25',
    },
    {
      id: 'CSITCAPI',
      from: 'From (..8280)',
      type: 'ACH Credit',
      amount: 'USD 100,01',
      status: 'Expired value date',
      cutOffDate: '10/02/25',
    },
  ],
};

type PaymentItem = (typeof mockPayments)['approve'][number];

type PaymentGroup = {
  date: string;
  payments: PaymentItem[];
};

const Payments: React.FC = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<'approve' | 'release'>('approve');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const currentPayments = activeTab === 'approve' ? mockPayments.approve : mockPayments.release;

  const groupedPayments: PaymentGroup[] = useMemo(() => {
    const groups = currentPayments.reduce<Record<string, PaymentItem[]>>((acc, payment) => {
      if (!acc[payment.cutOffDate]) {
        acc[payment.cutOffDate] = [];
      }
      acc[payment.cutOffDate].push(payment);
      return acc;
    }, {});

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, payments]) => ({ date, payments }));
  }, [currentPayments]);

  const clearSelection = () => {
    setIsSelectMode(false);
    setSelectedItems(new Set());
  };

  const handleSelectToggle = () => {
    if (isSelectMode) {
      clearSelection();
    } else {
      setIsSelectMode(true);
    }
  };

  const handleItemSelect = (paymentId: string) => {
    const next = new Set(selectedItems);
    if (next.has(paymentId)) {
      next.delete(paymentId);
    } else {
      next.add(paymentId);
    }
    setSelectedItems(next);
  };

  const handleActionClick = (actionType: 'approve' | 'release') => {
    const selectedPaymentItems = currentPayments.filter(payment =>
      selectedItems.has(payment.id)
    );

    clearSelection();
    history.push('/approve-release', {
      selectedItems: selectedPaymentItems,
      actionType,
    });
  };

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          <StackLayout gap={1} className="salt-toolbar-content">
            <FlexLayout align="center" justify="space-between" gap={2}>
              <Text styleAs="h4" className="salt-toolbar-title" style={{ flex: 1 }}>
                Pending payments
              </Text>
              {!isSelectMode && (
                <Button
                  appearance="transparent"
                  sentiment="neutral"
                  style={{
                    padding: `0 var(--salt-spacing-100)`,
                    minWidth: 'auto',
                  }}
                >
                  <Text styleAs="label">History</Text>
                </Button>
              )}
              <Button
                appearance="transparent"
                sentiment="neutral"
                onClick={handleSelectToggle}
                style={{
                  padding: `0 var(--salt-spacing-100)`,
                  minWidth: 'auto',
                }}
              >
                {isSelectMode ? (
                  <Text styleAs="label">Cancel</Text>
                ) : (
                  <ListCheck size={20} className="salt-inline-icon" />
                )}
              </Button>
            </FlexLayout>

            <FlexLayout align="center" gap={1} style={{ width: '100%', padding: 'var(--salt-spacing-100) 0' }}>
              <FlexLayout align="center" gap={1} className="salt-search-input">
                <Search size={20} className="salt-icon-subtle salt-inline-icon" />
                <input
                  type="search"
                  placeholder={activeTab === 'approve' ? 'Search approvals' : 'Search releases'}
                />
              </FlexLayout>
              <Button
                appearance="bordered"
                sentiment="neutral"
                className="salt-icon-button-circular"
                aria-label="Filter"
              >
                <Filter size={20} className="salt-filter-icon salt-inline-icon" />
              </Button>
            </FlexLayout>

            <div className="salt-payments-tabs">
              <button
                type="button"
                className={`salt-payments-tab ${activeTab === 'approve' ? 'salt-payments-tab-active' : ''}`}
                onClick={() => {
                  if (activeTab !== 'approve') {
                    clearSelection();
                    setActiveTab('approve');
                  }
                }}
              >
                <Text styleAs="label">Approve</Text>
              </button>
              <button
                type="button"
                className={`salt-payments-tab ${activeTab === 'release' ? 'salt-payments-tab-active' : ''}`}
                onClick={() => {
                  if (activeTab !== 'release') {
                    clearSelection();
                    setActiveTab('release');
                  }
                }}
              >
                <Text styleAs="label">Release</Text>
              </button>
            </div>
          </StackLayout>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content-wide" gap={2}>
            {groupedPayments.map(group => (
              <StackLayout key={group.date} gap={1}>
                <Text styleAs="label" className="salt-list-title">
                  Value date {group.date}
                </Text>

                <StackLayout gap={0}>
                  {group.payments.map(payment => {
                    const isSelected = selectedItems.has(payment.id);
                    return (
                      <div
                        key={payment.id}
                        className={`salt-list-item ${isSelectMode ? 'salt-list-item-has-checkbox' : ''} ${isSelectMode && isSelected ? 'salt-list-item-selected' : ''}`}
                        onClick={() => (isSelectMode ? handleItemSelect(payment.id) : undefined)}
                      >
                        {isSelectMode && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleItemSelect(payment.id)}
                            className="salt-list-item-checkbox"
                          />
                        )}
                        <FlexLayout align="start" justify="space-between" className="salt-list-item-content" gap={2}>
                          <StackLayout gap={0.2}>
                            <Text styleAs="h4">
                              {payment.id}
                            </Text>
                            <Text styleAs="label">
                              {payment.from}
                            </Text>
                          </StackLayout>
                          <StackLayout gap={0.5} align="end">
                            <FlexLayout align="center" gap={1}>
                              <Text styleAs="label">
                                {payment.type}
                              </Text>
                              <ArrowForward size={16} className="salt-inline-icon" />
                            </FlexLayout>
                            <Text styleAs="h4">
                              {payment.amount}
                            </Text>
                          </StackLayout>
                        </FlexLayout>
                      </div>
                    );
                  })}
                </StackLayout>
              </StackLayout>
            ))}
          </StackLayout>
        </div>
      </IonContent>

          {selectedItems.size > 0 && (
            <div className="salt-action-bar">
              <FlexLayout gap={1} className="salt-action-bar-buttons">
                <Button
                  appearance="bordered"
                  sentiment="neutral"
                  className="salt-action-bar-button salt-action-bar-button-reject"
                  onClick={clearSelection}
                >
                  <Text styleAs="label">Reject ({selectedItems.size})</Text>
                </Button>
                <Button
                  appearance="solid"
                  sentiment="accented"
                  className="salt-action-bar-button salt-action-bar-button-primary"
                  onClick={() => handleActionClick(activeTab)}
                >
                  <Text styleAs="label">
                    {activeTab === 'approve' ? 'Approve' : 'Release'} ({selectedItems.size})
                  </Text>
                </Button>
              </FlexLayout>
            </div>
          )}
    </IonPage>
  );
};

export default Payments;
