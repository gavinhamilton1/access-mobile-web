import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, Dropdown, FlexLayout, Option, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useParams } from 'react-router-dom';
import { accountsData } from '../data/accountsData';
import { ArrowBack, Filter, PiggyBank, Search, StarBlank, StarFilled, VisibilityOn } from '../components/icons';
import './home.css';

type Account = (typeof accountsData)[keyof typeof accountsData];

const timePeriods = ['Current day', 'Prior day', 'Last week'] as const;

const AccountDetails: React.FC = () => {
  const history = useHistory();
  const { accountId } = useParams<{ accountId: string }>();
  const [timePeriod, setTimePeriod] = useState<(typeof timePeriods)[number]>('Current day');

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

  const balanceItems = [
    { label: 'Opening balance', value: currentAccount.openingBalance },
    { label: 'Current balance', value: currentAccount.currentBalance },
    { label: 'Credits', value: currentAccount.credits, icon: <PiggyBank size={20} className="salt-inline-icon" /> },
    { label: 'Debits', value: currentAccount.debits, icon: <VisibilityOn size={20} className="salt-inline-icon" /> },
  ];

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          <div className="salt-toolbar-content">
            <div className="salt-header-left">
              <Button
                appearance="transparent"
                sentiment="neutral"
                onClick={handleBackClick}
                style={{ padding: `0 var(--salt-spacing-100)` }}
              >
                <div style={{ transform: 'rotate(-90deg)', display: 'inline-flex' }}>
                  <ArrowBack size={16} className="salt-inline-icon" />
                </div>
                <Text styleAs="label">Back</Text>
              </Button>
            </div>
            <div className="salt-header-center">
              <Text styleAs="h4" className="salt-toolbar-title" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {currentAccount.name}
              </Text>
              <Dropdown
                className="salt-period-dropdown"
                style={{ width: 'auto' }}
                selected={[timePeriod]}
                onSelectionChange={(_, nextSelected) => {
                  if (nextSelected[0]) {
                    setTimePeriod(nextSelected[0] as (typeof timePeriods)[number]);
                  }
                }}
                valueToString={item => item}
                variant="secondary"
              >
                {timePeriods.map(period => (
                  <Option key={period} value={period}>
                    {period}
                  </Option>
                ))}
              </Dropdown>
            </div>
            <div className="salt-header-right" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={2}>
            <Card className="salt-card">
              <StackLayout gap={1} className="salt-card-section">
                <FlexLayout align="start" justify="space-between" gap={2} className="salt-card-section-top-row">
                  <StackLayout gap={0.2}>
                    <Text styleAs="label">Current available</Text>
                    <Text styleAs="h3">
                      {currentAccount.currency} {currentAccount.currentBalance}
                    </Text>
                    <Text styleAs="label">{currentAccount.number}</Text>
                  </StackLayout>
                  <Button
                    appearance="transparent"
                    sentiment="neutral"
                    onClick={handleStarClick}
                    className="salt-star-button"
                  >
                    {currentAccount.isStarred ? (
                      <StarFilled size={20} className="salt-star-icon salt-star-icon-filled" />
                    ) : (
                      <StarBlank size={20} className="salt-star-icon" />
                    )}
                  </Button>
                </FlexLayout>

                <div className="salt-balance-section">
                  {balanceItems.map((item, index) => (
                    <div key={item.label} className={index > 0 ? 'salt-balance-row' : ''}>
                      <FlexLayout align="center" justify="space-between">
                        <FlexLayout align="center" gap={1}>
                          {item.icon}
                          <Text styleAs="label">{item.label}</Text>
                        </FlexLayout>
                        <Text styleAs="action">{item.value}</Text>
                      </FlexLayout>
                    </div>
                  ))}
                </div>
              </StackLayout>
            </Card>

            <StackLayout gap={1}>
              <FlexLayout align="center" justify="space-between">
                <Text styleAs="h3" className="salt-list-title">
                  Transactions
                </Text>
                <Button
                  appearance="bordered"
                  sentiment="neutral"
                  style={{ 
                    borderRadius: '999px', 
                    padding: `var(--salt-spacing-50) var(--salt-spacing-150)`,
                    fontSize: '0.75rem',
                  }}
                >
                  <Text styleAs="label">Export CSV</Text>
                </Button>
              </FlexLayout>
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
            </StackLayout>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AccountDetails;
