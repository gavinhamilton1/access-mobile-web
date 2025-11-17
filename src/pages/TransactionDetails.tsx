import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation } from 'react-router-dom';
import { ArrowBack, ArrowUp, Warning } from '../components/icons';
import { paymentsData, type PaymentItem } from '../data/paymentsData';
import { transactionsData, type Transaction } from '../data/transactionsData';
import './home.css';

// Union type for transaction data
type TransactionData = PaymentItem | Transaction;

interface LocationState {
  transaction?: TransactionData;
  actionType?: 'approve' | 'release';
  source?: 'payments' | 'accounts';
}

const TransactionDetails: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const state = location.state as LocationState;
  
  // Get transaction data from state or use fallback
  const transaction: TransactionData = state?.transaction || paymentsData.approve[0];
  const actionType = state?.actionType;
  const source = state?.source || 'payments';

  // Determine if this is from payments (has actionType) or accounts (no actionType)
  const isPaymentTransaction = source === 'payments' && actionType !== undefined;
  const showActionButtons = isPaymentTransaction;

  const handleBackClick = () => {
    history.goBack();
  };

  const handleReject = () => {
    // Handle reject action
    console.log('Reject transaction:', transaction.id);
    history.goBack();
  };

  const handleAction = () => {
    // Handle approve/release action
    if (actionType) {
      console.log(`${actionType} transaction:`, transaction.id);
    }
    history.goBack();
  };

  const splitAmount = (amount: string) => {
    // Extract currency and amount
    const match = amount.match(/^([A-Z]{3})\s*(.+)$/);
    if (match) {
      const [, currency, amountStr] = match;
      const parts = amountStr.replace(/\s/g, '').replace(',', '.').split('.');
      return {
        currency,
        value: parts[0] || amountStr,
        decimals: parts[1] ? '.' + parts[1] : '',
      };
    }
    // Fallback if format doesn't match
    const parts = amount.replace(',', '.').split('.');
    return {
      currency: 'USD',
      value: parts[0] || amount,
      decimals: parts[1] ? '.' + parts[1] : '',
    };
  };

  const amountParts = splitAmount(transaction.amount);

  // Use transaction details from transaction data if available, otherwise use defaults
  const transactionDetails = {
    orderingAccountNumber: transaction.orderingAccountNumber || '000000777171554',
    orderingAccountName: transaction.orderingAccountName || (transaction.from ? transaction.from.replace('From (', '').replace(')', '') : 'Unknown'),
    branchLocation: transaction.branchLocation || 'JPMORGAN CHASE BANK, N.A. - UTAH',
    bankName: transaction.bankName || 'JPMORGAN CHASE BANK, N.A.',
    bankId: transaction.bankId || '124001545',
    companyName: transaction.companyName || 'N16411071',
    companyId: transaction.companyId || '16411071',
    valueDate: transaction.valueDate || transaction.cutOffDate,
    paymentMethod: transaction.paymentMethod || transaction.type,
    paymentAmount: transaction.paymentAmount || transaction.amount,
  };

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
                  <Text styleAs="label">{amountParts.currency}</Text>
                </StackLayout>
                <StackLayout gap={0.2} align="end">
                  <FlexLayout align="center" gap={1}>
                    <Warning size={20} className="salt-inline-icon salt-icon-subtle salt-home-alert-icon" />
                    <Text styleAs="label">{transaction.status}</Text>
                  </FlexLayout>
                  <Text styleAs="label">{transaction.cutOffDate}</Text>
                </StackLayout>
              </FlexLayout>
            </div>

            {/* Transaction Information Header */}
            <div
              className="salt-list-item"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ cursor: 'pointer' }}
            >
              <FlexLayout align="center" justify="space-between" className="salt-list-item-content">
                <Text styleAs="h4">Transaction information</Text>
                <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <ArrowUp size={20} className="salt-inline-icon" />
                </div>
              </FlexLayout>
            </div>

            {/* Transaction Details (no card styling) */}
            {isExpanded && (
              <StackLayout gap={0} style={{ padding: '0 var(--salt-spacing-150)' }}>
                <div className="salt-balance-summary">
                  <FlexLayout align="start" justify="space-between" gap={2}>
                    <Text styleAs="label">Ordering/originating account number:</Text>
                    <Text styleAs="action" style={{ textAlign: 'right' }}>{transactionDetails.orderingAccountNumber}</Text>
                  </FlexLayout>
                </div>
                <div className="salt-balance-summary">
                  <FlexLayout align="start" justify="space-between" gap={2}>
                    <Text styleAs="label">Ordering/originating account name:</Text>
                    <Text styleAs="action" style={{ textAlign: 'right' }}>{transactionDetails.orderingAccountName}</Text>
                  </FlexLayout>
                </div>
                <div className="salt-balance-summary">
                  <FlexLayout align="start" justify="space-between" gap={2}>
                    <Text styleAs="label">Branch location:</Text>
                    <Text styleAs="action" style={{ textAlign: 'right' }}>{transactionDetails.branchLocation}</Text>
                  </FlexLayout>
                </div>
                <div className="salt-balance-summary">
                  <FlexLayout align="start" justify="space-between" gap={2}>
                    <Text styleAs="label">Bank name:</Text>
                    <Text styleAs="action" style={{ textAlign: 'right' }}>{transactionDetails.bankName}</Text>
                  </FlexLayout>
                </div>
                <div className="salt-balance-summary">
                  <FlexLayout align="start" justify="space-between" gap={2}>
                    <Text styleAs="label">Bank ID:</Text>
                    <Text styleAs="action" style={{ textAlign: 'right' }}>{transactionDetails.bankId}</Text>
                  </FlexLayout>
                </div>
                <div className="salt-balance-summary">
                  <FlexLayout align="start" justify="space-between" gap={2}>
                    <Text styleAs="label">Company / entity name and ID:</Text>
                    <Text styleAs="action" style={{ textAlign: 'right' }}>{transactionDetails.companyName} / {transactionDetails.companyId}</Text>
                  </FlexLayout>
                </div>
                <div className="salt-balance-summary">
                  <FlexLayout align="start" justify="space-between" gap={2}>
                    <Text styleAs="label">Value date:</Text>
                    <Text styleAs="action" style={{ textAlign: 'right' }}>{transactionDetails.valueDate}</Text>
                  </FlexLayout>
                </div>
                <div className="salt-balance-summary">
                  <FlexLayout align="start" justify="space-between" gap={2}>
                    <Text styleAs="label">Payment method:</Text>
                    <Text styleAs="action" style={{ textAlign: 'right' }}>{transactionDetails.paymentMethod}</Text>
                  </FlexLayout>
                </div>
                <div className="salt-balance-summary">
                  <FlexLayout align="start" justify="space-between" gap={2}>
                    <Text styleAs="label">Payment amount:</Text>
                    <Text styleAs="action" style={{ textAlign: 'right' }}>{transactionDetails.paymentAmount}</Text>
                  </FlexLayout>
                </div>
              </StackLayout>
            )}
          </StackLayout>
        </div>

        {/* Bottom Action Bar - only show for payment transactions */}
        {showActionButtons && (
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
                onClick={handleAction}
              >
                <Text styleAs="label">{actionType === 'approve' ? 'Approve' : 'Release'}</Text>
              </Button>
            </FlexLayout>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TransactionDetails;
