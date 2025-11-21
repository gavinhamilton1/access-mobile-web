import React, { useState, useRef, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation } from 'react-router-dom';
import { ArrowBack, ChevronUp, Warning } from '../components/icons';
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');

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

  // Measure content height for smooth collapse animation
  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        // Set to actual height when expanding
        setContentHeight(contentRef.current.scrollHeight);
      } else {
        // Set to 0 when collapsing
        setContentHeight(0);
      }
    }
  }, [isExpanded]);

  // Measure initial height on mount
  useEffect(() => {
    if (contentRef.current) {
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      }, 0);
    }
  }, []);

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
          <div className="salt-toolbar-3column">
            <div className="salt-toolbar-column-left">
              <Button
                appearance="transparent"
                sentiment="neutral"
                onClick={handleBackClick}
                style={{ padding: `0 var(--salt-spacing-100)` }}
              >
                <ArrowBack size={18} className="salt-inline-icon" />
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
          <StackLayout gap={0.5}>
            {/* Transaction Summary Header */}
            <div style={{ padding: 'var(--salt-spacing-150) var(--salt-spacing-150) var(--salt-spacing-100)' }}>
              <StackLayout gap={1}>
                <FlexLayout align="center" justify="space-between" gap={2}>
                  <FlexLayout align="center" gap={0.5} style={{ flexWrap: 'nowrap', minWidth: 0 }}>
                    <div className="salt-amount" style={{ paddingTop: 0, flexShrink: 0 }}>
                      <Text styleAs="h4">{amountParts.value}{amountParts.decimals}</Text>
                    </div>
                    <Text styleAs="label" style={{ whiteSpace: 'nowrap' }}>{amountParts.currency}</Text>
                  </FlexLayout>
                  <FlexLayout align="center" gap={0.5} style={{ flexShrink: 0 }}>
                    <Warning size={24} className="salt-inline-icon salt-icon-subtle salt-home-alert-icon" color="var(--salt-status-warning-foreground)" />
                    <Text styleAs="label" style={{ color: 'var(--salt-status-warning-foreground)' }}>{transaction.status}</Text>
                  </FlexLayout>
                </FlexLayout>

                <FlexLayout align="center" justify="space-between" gap={2}>
                  <FlexLayout align="center" gap={1} style={{ flexWrap: 'nowrap', minWidth: 0 }}>
                    <Text styleAs="label">Value date</Text>
                  </FlexLayout>
                  <FlexLayout align="center" gap={1} style={{ flexShrink: 0 }}>
                    <Text styleAs="label">{transaction.cutOffDate}</Text>
                  </FlexLayout>
                </FlexLayout>
              </StackLayout>
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
                  <ChevronUp size={20} className="salt-inline-icon" />
                </div>
              </FlexLayout>
            </div>

            {/* Transaction Details (no card styling) */}
            <div
              ref={contentRef}
              style={{
                height: contentHeight === 'auto' ? 'auto' : `${contentHeight}px`,
                overflow: 'hidden',
                transition: 'height 0.3s ease-in-out',
              }}
            >
              <StackLayout gap={0} style={{ padding: '0 var(--salt-spacing-150) 150px' }}>
                <div className="salt-transaction-row">
                  <StackLayout gap={0.5}>
                    <Text styleAs="h4">Ordering/originating account number:</Text>
                    <Text styleAs="label">{transactionDetails.orderingAccountNumber}</Text>
                  </StackLayout>
                </div>
                <div className="salt-transaction-row">
                  <StackLayout gap={0.5}>
                    <Text styleAs="h4">Ordering/originating account name:</Text>
                    <Text styleAs="label">{transactionDetails.orderingAccountName}</Text>
                  </StackLayout>
                </div>
                <div className="salt-transaction-row">
                  <StackLayout gap={0.5}>
                    <Text styleAs="h4">Branch location:</Text>
                    <Text styleAs="label">{transactionDetails.branchLocation}</Text>
                  </StackLayout>
                </div>
                <div className="salt-transaction-row">
                  <StackLayout gap={0.5}>
                    <Text styleAs="h4">Bank name:</Text>
                    <Text styleAs="label">{transactionDetails.bankName}</Text>
                  </StackLayout>
                </div>
                <div className="salt-transaction-row">
                  <StackLayout gap={0.5}>
                    <Text styleAs="h4">Bank ID:</Text>
                    <Text styleAs="label">{transactionDetails.bankId}</Text>
                  </StackLayout>
                </div>
                <div className="salt-transaction-row">
                  <StackLayout gap={0.5}>
                    <Text styleAs="h4">Company / entity name and ID:</Text>
                    <Text styleAs="label">{transactionDetails.companyName} / {transactionDetails.companyId}</Text>
                  </StackLayout>
                </div>
                <div className="salt-transaction-row">
                  <StackLayout gap={0.5}>
                    <Text styleAs="h4">Value date:</Text>
                    <Text styleAs="label">{transactionDetails.valueDate}</Text>
                  </StackLayout>
                </div>
                <div className="salt-transaction-row">
                  <StackLayout gap={0.5}>
                    <Text styleAs="h4">Payment method:</Text>
                    <Text styleAs="label">{transactionDetails.paymentMethod}</Text>
                  </StackLayout>
                </div>
                <div className="salt-transaction-row">
                  <StackLayout gap={0.5}>
                    <Text styleAs="h4">Payment amount:</Text>
                    <Text styleAs="label">{transactionDetails.paymentAmount}</Text>
                  </StackLayout>
                </div>
              </StackLayout>
            </div>
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
