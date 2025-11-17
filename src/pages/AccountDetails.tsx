import React, { useMemo, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, Dropdown, FlexLayout, Option, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useParams } from 'react-router-dom';
import { accountsData } from '../data/accountsData';
import { transactionsData, type Transaction } from '../data/transactionsData';
import { ArrowBack, ArrowForward, Cash, Filter, PiggyBank, Search, StarBlank, StarFilled } from '../components/icons';
import './home.css';

type Account = (typeof accountsData)[keyof typeof accountsData];

const currencyCodes = ['USD', 'EUR', 'GBP', 'AUD'] as const;
const timePeriods = ['Current day', 'Prior day', 'Last week'] as const;

const AccountDetails: React.FC = () => {
  const history = useHistory();
  const { accountId } = useParams<{ accountId: string }>();
  const [timePeriod, setTimePeriod] = useState<(typeof timePeriods)[number]>('Current day');
  const [currency, setCurrency] = useState<(typeof currencyCodes)[number]>('USD');

  const [accounts, setAccounts] = useState<Record<string, Account>>(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts ? JSON.parse(savedAccounts) : accountsData;
  });

  const currentAccount = accounts[accountId] ?? accounts['ACCT-0016710022006603'];

  const handleBackClick = () => {
    history.goBack();
  };

  const handleStarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedAccounts = {
      ...accounts,
      [currentAccount.id]: {
        ...currentAccount,
        isStarred: !currentAccount.isStarred,
      },
    };
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  };

  const totals = useMemo(() => {
    const currentAvailable = currentAccount.currentBalance;
    const openingBalance = currentAccount.openingBalance;
    const currentBalance = currentAvailable;

    const splitAmount = (amount: string) => {
      const parts = amount.replace(',', '.').split('.');
      return {
        value: parts[0],
        decimals: parts[1] ? '.' + parts[1] : '.00',
      };
    };

    return {
      currentAvailable: splitAmount(currentAvailable),
      openingBalance: splitAmount(openingBalance),
      currentBalance: splitAmount(currentBalance),
      credits: currentAccount.credits,
      debits: currentAccount.debits,
    };
  }, [currentAccount]);

  const balanceItems = useMemo(
    () => [
      { icon: <PiggyBank size={24} className="salt-inline-icon" />, label: 'Credits', value: totals.credits },
      { icon: <Cash size={24} className="salt-inline-icon" />, label: 'Debits', value: totals.debits },
    ],
    [totals.credits, totals.debits],
  );

  // Get transactions for the current account
  const transactions = (accountId && accountId in transactionsData) 
    ? transactionsData[accountId as keyof typeof transactionsData] 
    : [];

  const handleTransactionClick = (transaction: Transaction) => {
    history.push('/transaction-details', {
      transaction,
      source: 'accounts',
    });
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
                <ArrowBack size={18} className="salt-inline-icon" />
              </Button>
            </div>
            <div className="salt-toolbar-column-center">
              <Text styleAs="h4" className="salt-toolbar-title">
                {currentAccount.name}
              </Text>
              <Dropdown
                className="salt-dropdown"
                selected={[timePeriod]}
                onSelectionChange={(_, nextSelected) => {
                  if (nextSelected[0]) {
                    setTimePeriod(nextSelected[0] as (typeof timePeriods)[number]);
                  }
                }}
                valueToString={item => item}
              >
                {timePeriods.map(period => (
                  <Option key={period} value={period}>
                    {period}
                  </Option>
                ))}
              </Dropdown>
            </div>
            <div className="salt-toolbar-column-right" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={0.5}>
            <Card className="salt-card">
              <StackLayout gap={0} className="salt-card-section">
                <FlexLayout align="start" justify="space-between" className="salt-card-section-top-row">
                  <StackLayout gap={0.2}>
                    <Text styleAs="label">
                      Current available
                    </Text>
                    <div className="salt-amount">
                      <Text className="salt-current-amount-value">
                        {totals.currentAvailable.value}
                      </Text>
                      <Text className="salt-current-amount-decimals">
                        {totals.currentAvailable.decimals}
                      </Text>
                    </div>
                  </StackLayout>

                  <Dropdown
                    className="salt-dropdown"
                    style={{ width: 'auto', flexShrink: 0 }}
                    selected={[currency]}
                    onSelectionChange={(_, nextSelected) => {
                      if (nextSelected[0]) {
                        setCurrency(nextSelected[0] as (typeof currencyCodes)[number]);
                      }
                    }}
                    valueToString={item => item}
                    variant="secondary"
                  >
                    {currencyCodes.map(code => (
                      <Option key={code} value={code}>
                        {code}
                      </Option>
                    ))}
                  </Dropdown>
                </FlexLayout>

                <div className="salt-balance-summary">
                    <FlexLayout align="center" justify="space-between">
                      <FlexLayout align="center" gap={1}>
                        <Text styleAs="label">Opening balance</Text>
                      </FlexLayout>
                      <div className="salt-amount">
                      <Text className="salt-balance-value">
                        {totals.openingBalance.value}
                      </Text>
                      <Text className="salt-balance-decimals">
                        {totals.openingBalance.decimals}
                      </Text>
                    </div>
                    </FlexLayout>
                  </div>


                <div className="salt-balance-summary">
                    <FlexLayout align="center" justify="space-between">
                      <FlexLayout align="center" gap={1}>
                        <Text styleAs="label">Current balance</Text>
                      </FlexLayout>
                      <div className="salt-amount">
                      <Text className="salt-balance-value">
                        {totals.currentBalance.value}
                      </Text>
                      <Text className="salt-balance-decimals">
                        {totals.currentBalance.decimals}
                      </Text>
                    </div>
                    </FlexLayout>
                  </div>

                {balanceItems.map(item => (
                  <div key={item.label} className="salt-balance-summary">
                    <FlexLayout align="center" justify="space-between">
                      <FlexLayout align="center" gap={1}>
                        {item.icon}
                        <Text styleAs="label">{item.label}</Text>
                      </FlexLayout>
                      <Text styleAs="action">
                        {item.value}
                      </Text>
                    </FlexLayout>
                  </div>
                ))}
              </StackLayout>
            </Card>

            <StackLayout gap={1}>
              <FlexLayout align="center" justify="space-between">
                <Text styleAs="h4" className="salt-list-title">
                  Transactions
                </Text>
                <Button
                  appearance="bordered"
                  sentiment="neutral"
                  className="salt-action-bar-button "
                >
                  <Text styleAs="label">Export CSV</Text>
                </Button>
              </FlexLayout>
              {transactions.length > 0 ? (
                <StackLayout gap={0}>
                  {transactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className="salt-list-item"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <FlexLayout align="start" justify="space-between" className="salt-list-item-content" gap={2}>
                        <StackLayout gap={0.2}>
                          <Text styleAs="h4">
                            {transaction.id}
                          </Text>
                          <Text styleAs="label">
                            {transaction.from}
                          </Text>
                        </StackLayout>
                        <StackLayout gap={0.5} align="end">
                          <FlexLayout align="center" gap={1}>
                            <Text styleAs="label">
                              {transaction.type}
                            </Text>
                            <ArrowForward size={16} className="salt-inline-icon" />
                          </FlexLayout>
                          <Text styleAs="h4">
                            {transaction.amount}
                          </Text>
                        </StackLayout>
                      </FlexLayout>
                    </div>
                  ))}
                </StackLayout>
              ) : (
                <Card className="salt-card">
                  <StackLayout gap={1} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150)' }}>
                    <FlexLayout align="center" gap={1} className="salt-search-input">
                      <Search size={20} className="salt-icon-subtle salt-inline-icon" />
                      <input
                        type="search"
                        placeholder="Search transactions"
                        style={{ fontSize: '0.875rem' }}
                      />
                      <Filter size={20} className="salt-filter-icon salt-inline-icon" />
                    </FlexLayout>
                    <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)', fontSize: '0.75rem' }}>
                      Recent activity will appear here once transactions are available.
                    </Text>
                  </StackLayout>
                </Card>
              )}
            </StackLayout>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AccountDetails;
