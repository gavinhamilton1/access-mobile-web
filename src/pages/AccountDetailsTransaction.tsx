import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ArrowBack, ArrowUp, Warning } from '../components/icons';
import './home.css';

type Transaction = {
  id: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  date: string;
  orderingAccountNumber: string;
  orderingAccountName: string;
  branchLocation: string;
  bankName: string;
  bankId: string;
  companyName: string;
  companyId: string;
  valueDate: string;
  paymentMethod: string;
  paymentAmount: string;
};

interface LocationState {
  transaction?: Transaction;
}

const AccountDetailsTransaction: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { accountId } = useParams<{ accountId: string }>();
  const [isExpanded, setIsExpanded] = useState(true);

  const state = location.state as LocationState;
  
  // Mock transaction data if not passed via state
  const transaction: Transaction = state?.transaction || {
    id: 'Analytics03102025.230927',
    type: 'Wire',
    amount: '88 547.00',
    currency: 'USD',
    status: 'Pending release',
    date: '11/15/2025',
    orderingAccountNumber: '000000777171554',
    orderingAccountName: 'SUNITHA TRAVEL',
    branchLocation: 'JPMORGAN CHASE BANK, N.A. - UTAH',
    bankName: 'JPMORGAN CHASE BANK, N.A.',
    bankId: '124001545',
    companyName: 'N16411071',
    companyId: '16411071',
    valueDate: '10/02/2025',
    paymentMethod: 'ACH Credit',
    paymentAmount: 'USD 3.45',
  };

  const handleBackClick = () => {
    history.goBack();
  };

  const handleReject = () => {
    // Handle reject action
    console.log('Reject transaction:', transaction.id);
  };

  const handleRelease = () => {
    // Handle release action
    console.log('Release transaction:', transaction.id);
  };

  const splitAmount = (amount: string) => {
    const parts = amount.replace(',', '.').split('.');
    return {
      value: parts[0] || amount,
      decimals: parts[1] ? '.' + parts[1] : '',
    };
  };

  const amountParts = splitAmount(transaction.amount);

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          <div className="salt-toolbar-3column" style={{ alignItems: 'flex-start' }}>
            <div className="salt-toolbar-column-left">
              <Button
                appearance="transparent"
                sentiment="neutral"
                onClick={handleBackClick}
                style={{ padding: `0 var(--salt-spacing-100)` }}
              >
                <Text styleAs="label">Back</Text>
              </Button>
            </div>
            <div className="salt-toolbar-column-center">
              <Text styleAs="h4" className="salt-toolbar-title">
                {transaction.type}
              </Text>
            </div>
            <div className="salt-toolbar-column-right" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={1}>
            {/* Transaction Summary Header */}
            <div style={{ padding: 'var(--salt-spacing-150) var(--salt-spacing-150) var(--salt-spacing-100)' }}>
              <FlexLayout align="start" justify="space-between" gap={2}>
                <StackLayout gap={0.2}>
                  <div className="salt-amount" style={{ paddingTop: 0 }}>
                    <Text className="salt-current-amount-value">
                      {amountParts.value}
                    </Text>
                    {amountParts.decimals && (
                      <Text className="salt-current-amount-decimals">
                        {amountParts.decimals}
                      </Text>
                    )}
                  </div>
                  <Text styleAs="label">{transaction.currency}</Text>
                </StackLayout>
                <StackLayout gap={0.2} align="end">
                  <FlexLayout align="center" gap={1}>
                    <Warning size={20} className="salt-inline-icon salt-icon-subtle salt-home-alert-icon" />
                    <Text styleAs="label">{transaction.status}</Text>
                  </FlexLayout>
                  <Text styleAs="label">{transaction.date}</Text>
                </StackLayout>
              </FlexLayout>
            </div>

            {/* Transaction Information Card */}
            <Card className="salt-card">
              <StackLayout gap={0} className="salt-card-section">
                <FlexLayout
                  align="center"
                  justify="space-between"
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ cursor: 'pointer', padding: 'var(--salt-spacing-150)' }}
                >
                  <Text styleAs="h4">Transaction information</Text>
                  <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <ArrowUp size={20} className="salt-inline-icon" />
                  </div>
                </FlexLayout>

                {isExpanded && (
                  <StackLayout gap={0} style={{ padding: '0 var(--salt-spacing-150) var(--salt-spacing-150)' }}>
                    <div className="salt-balance-summary">
                      <FlexLayout align="start" justify="space-between" gap={2}>
                        <Text styleAs="label">Ordering/originating account number:</Text>
                        <Text styleAs="action" style={{ textAlign: 'right' }}>{transaction.orderingAccountNumber}</Text>
                      </FlexLayout>
                    </div>
                    <div className="salt-balance-summary">
                      <FlexLayout align="start" justify="space-between" gap={2}>
                        <Text styleAs="label">Ordering/originating account name:</Text>
                        <Text styleAs="action" style={{ textAlign: 'right' }}>{transaction.orderingAccountName}</Text>
                      </FlexLayout>
                    </div>
                    <div className="salt-balance-summary">
                      <FlexLayout align="start" justify="space-between" gap={2}>
                        <Text styleAs="label">Branch location:</Text>
                        <Text styleAs="action" style={{ textAlign: 'right' }}>{transaction.branchLocation}</Text>
                      </FlexLayout>
                    </div>
                    <div className="salt-balance-summary">
                      <FlexLayout align="start" justify="space-between" gap={2}>
                        <Text styleAs="label">Bank name:</Text>
                        <Text styleAs="action" style={{ textAlign: 'right' }}>{transaction.bankName}</Text>
                      </FlexLayout>
                    </div>
                    <div className="salt-balance-summary">
                      <FlexLayout align="start" justify="space-between" gap={2}>
                        <Text styleAs="label">Bank ID:</Text>
                        <Text styleAs="action" style={{ textAlign: 'right' }}>{transaction.bankId}</Text>
                      </FlexLayout>
                    </div>
                    <div className="salt-balance-summary">
                      <FlexLayout align="start" justify="space-between" gap={2}>
                        <Text styleAs="label">Company / entity name and ID:</Text>
                        <Text styleAs="action" style={{ textAlign: 'right' }}>{transaction.companyName} / {transaction.companyId}</Text>
                      </FlexLayout>
                    </div>
                    <div className="salt-balance-summary">
                      <FlexLayout align="start" justify="space-between" gap={2}>
                        <Text styleAs="label">Value date:</Text>
                        <Text styleAs="action" style={{ textAlign: 'right' }}>{transaction.valueDate}</Text>
                      </FlexLayout>
                    </div>
                    <div className="salt-balance-summary">
                      <FlexLayout align="start" justify="space-between" gap={2}>
                        <Text styleAs="label">Payment method:</Text>
                        <Text styleAs="action" style={{ textAlign: 'right' }}>{transaction.paymentMethod}</Text>
                      </FlexLayout>
                    </div>
                    <div className="salt-balance-summary">
                      <FlexLayout align="start" justify="space-between" gap={2}>
                        <Text styleAs="label">Payment amount:</Text>
                        <Text styleAs="action" style={{ textAlign: 'right' }}>{transaction.paymentAmount}</Text>
                      </FlexLayout>
                    </div>
                  </StackLayout>
                )}
              </StackLayout>
            </Card>
          </StackLayout>
        </div>

        {/* Bottom Action Bar */}
        <div className="salt-action-bar">
          <FlexLayout gap={1} className="salt-action-bar-buttons">
            <Button
              appearance="bordered"
              sentiment="neutral"
              className="salt-action-bar-button salt-action-bar-button-reject"
              onClick={handleReject}
            >
              <Text styleAs="label">Reject</Text>
            </Button>
            <Button
              appearance="solid"
              sentiment="accented"
              className="salt-action-bar-button salt-action-bar-button-primary"
              onClick={handleRelease}
            >
              <Text styleAs="label">Release</Text>
            </Button>
          </FlexLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AccountDetailsTransaction;

