import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, Dropdown, FlexLayout, Option, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { accountsData } from '../data/accountsData';

import {
  ArrowForward,
  ArrowDown,
  Cash,
  Filter,
  PiggyBank,
  SortDown,
  SortUp,
  StarBlank,
  StarFilled,
} from '../components/icons';

import './home.css';

type Account = (typeof accountsData)[keyof typeof accountsData];

const mockAccounts: Record<string, Account> = accountsData;

const currencyCodes = ['USD', 'EUR', 'GBP', 'AUD'] as const;
const timePeriods = ['Current day', 'Prior day', 'Last week'] as const;

const Accounts: React.FC = () => {
  const history = useHistory();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currency, setCurrency] = useState<(typeof currencyCodes)[number]>('USD');
  const [timePeriod, setTimePeriod] = useState<(typeof timePeriods)[number]>('Current day');
  const [accounts, setAccounts] = useState<Record<string, Account>>(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts ? JSON.parse(savedAccounts) : mockAccounts;
  });
  
  // Store the display order separately - only changes when sort button is clicked
  // Initialize with sorted order
  const getSortedAccountIds = (accountsToSort: Record<string, Account>, order: 'asc' | 'desc') => {
    const accountList = Object.values(accountsToSort);
    const sorted = [...accountList].sort((a, b) => {
      // First, prioritize starred accounts (starred comes first)
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;
      
      // If both have the same starred status, sort alphabetically by name
      const nameA = a.name.trim().toLowerCase();
      const nameB = b.name.trim().toLowerCase();
      
      // Sort by name according to sortOrder (A-Z for asc, Z-A for desc)
      const comparison = nameA.localeCompare(nameB, 'en', { numeric: true, sensitivity: 'base' });
      return order === 'asc' ? comparison : -comparison;
    });
    return sorted.map(acc => acc.id);
  };
  
  const [displayOrder, setDisplayOrder] = useState<string[]>(() => {
    // Initialize with sorted order from initial accounts
    const initialAccounts = (() => {
      const savedAccounts = localStorage.getItem('accounts');
      return savedAccounts ? JSON.parse(savedAccounts) : mockAccounts;
    })();
    return getSortedAccountIds(initialAccounts, 'asc');
  });
  
  // Track the latest accounts using a ref to avoid dependency issues
  const accountsRef = useRef(accounts);
  useEffect(() => {
    accountsRef.current = accounts;
  }, [accounts]);
  
  // Update display order only when sortOrder changes (sort button clicked)
  // Use ref to get latest accounts without including it in dependencies
  useEffect(() => {
    const currentAccounts = accountsRef.current;
    if (!currentAccounts || Object.keys(currentAccounts).length === 0) {
      return;
    }
    
    // Re-sort and update display order
    const newDisplayOrder = getSortedAccountIds(currentAccounts, sortOrder);
    setDisplayOrder(newDisplayOrder);
  }, [sortOrder]); // Only depend on sortOrder - not accounts
  
  // Use displayOrder to maintain order when accounts change (e.g., star clicks)
  // This preserves the current display order even when account data changes
  const displayedAccounts = useMemo(() => {
    if (!accounts || Object.keys(accounts).length === 0 || displayOrder.length === 0) {
      return [];
    }
    
    // Create a map of accounts by ID for quick lookup
    const accountsById = Object.values(accounts).reduce((acc, account) => {
      acc[account.id] = account;
      return acc;
    }, {} as Record<string, Account>);
    
    // Return accounts in displayOrder, filtering out any that no longer exist
    // This maintains the order from displayOrder even when account data changes
    return displayOrder
      .map(id => accountsById[id])
      .filter((account): account is Account => account !== undefined);
  }, [accounts, displayOrder]);

  const handleAccountClick = (accountId: string) => {
    history.push(`/accounts/account-details/${accountId}`);
  };

  const handleSortClick = () => {
    // Trigger re-sort by changing sortOrder
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
  };

  const handleStarClick = (accountId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedAccounts = {
      ...accounts,
      [accountId]: {
        ...accounts[accountId],
        isStarred: !accounts[accountId].isStarred,
      },
    };
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    // Remove direct setSortedAccounts - let useEffect handle re-sorting
  };

  // Calculate totals from all accounts
  const totals = useMemo(() => {
    const allAccounts = Object.values(accounts);
    const currentAvailable = allAccounts
      .reduce((sum, acc) => {
        const balance = parseFloat(acc.currentBalance.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
        return sum + balance;
      }, 0)
      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .replace(',', ' ');
    
    const openingBalance = allAccounts
      .reduce((sum, acc) => {
        const balance = parseFloat(acc.openingBalance.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
        return sum + balance;
      }, 0)
      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .replace(',', ' ');
    
    const currentBalance = currentAvailable;
    
    const credits = allAccounts
      .reduce((sum, acc) => {
        const credit = parseFloat(acc.credits.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
        return sum + credit;
      }, 0)
      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .replace(',', ' ');
    
    const debits = allAccounts
      .reduce((sum, acc) => {
        const debit = parseFloat(acc.debits.replace(/[^\d,.-]/g, '').replace(/[()]/g, '').replace(',', '.')) || 0;
        return sum + debit;
      }, 0);
    
    return {
      currentAvailable: {
        value: currentAvailable.split('.')[0].replace(/\s/g, ' '),
        decimals: '.' + currentAvailable.split('.')[1],
      },
      openingBalance: {
        value: openingBalance.split('.')[0].replace(/\s/g, ' '),
        decimals: '.' + openingBalance.split('.')[1],
      },
      currentBalance: {
        value: currentBalance.split('.')[0].replace(/\s/g, ' '),
        decimals: '.' + currentBalance.split('.')[1],
      },
      credits,
      debits: `(${debits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', ' ')})`,
    };
  }, [accounts]);

  const balanceItems = useMemo(
    () => [
      { icon: <PiggyBank size={24} className="salt-inline-icon" />, label: 'Credits', value: totals.credits },
      { icon: <Cash size={24} className="salt-inline-icon" />, label: 'Debits', value: totals.debits },
    ],
    [totals.credits, totals.debits],
  );

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          <div className="salt-toolbar-content">
            <div className="salt-header-left" />
            <div className="salt-header-center">
              <Text styleAs="h4" className="salt-toolbar-title">
                Accounts
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
            <div className="salt-header-right">
              <Button
                appearance="transparent"
                sentiment="neutral"
                className="salt-filter-button"
                onClick={handleSortClick}
                aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {sortOrder === 'asc' ? (
                  <SortDown size={20} className="salt-filter-icon" />
                ) : (
                  <SortUp size={20} className="salt-filter-icon" />
                )}
              </Button>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={1}>
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
                    className="salt-currency-dropdown"
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

                <div className="salt-balance-row">
                  <FlexLayout align="center" justify="space-between">
                    <Text styleAs="label">Opening balance</Text>
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

                <div className="salt-balance-row">
                  <FlexLayout align="center" justify="space-between">
                    <Text styleAs="label">Current balance</Text>
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
                    <FlexLayout align="center" justify="space-between" className="salt-balance-row">
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

            <div className="salt-list-header">
              <Text styleAs="h3" className="salt-list-title">
                Accounts
              </Text>
            </div>

            <StackLayout gap={1} className="salt-list">
              {displayedAccounts.map((account: Account) => (
                <Card
                  key={account.id}
                  className="salt-account-card"
                  onClick={() => handleAccountClick(account.id)}
                >
                  <FlexLayout align="center" justify="space-between" className="salt-account-row">
                    <Button
                      appearance="transparent"
                      sentiment="neutral"
                      className="salt-star-button"
                      onClick={(e: React.MouseEvent) => handleStarClick(account.id, e)}
                      aria-label={account.isStarred ? 'Unstar account' : 'Star account'}
                    >
                      {account.isStarred ? (
                        <StarFilled size={20} className="salt-star-icon salt-star-icon-filled" />
                      ) : (
                        <StarBlank size={20} className="salt-star-icon" />
                      )}
                    </Button>
                    <div className="salt-account-info">
                      <Text styleAs="h4" className="salt-account-name">
                        {account.name}
                        <span className="salt-account-number">
                          {' '}({account.number.replace(/[()]/g, '').replace('...', '')})
                        </span>
                      </Text>
                      <Text styleAs="label" className="salt-account-balance">
                        {account.currency} {account.currentBalance}
                      </Text>
                    </div>
                    <ArrowForward size={20} className="salt-arrow-icon" />
                  </FlexLayout>
                </Card>
              ))}
            </StackLayout>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Accounts;
