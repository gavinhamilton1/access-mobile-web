import React, { useMemo, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, Dropdown, FlexLayout, Option, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';

import { useSaltTheme } from '../theme/SaltThemeProvider';
import {
  Alert,
  Camera,
  Cash,
  Check,
  CircleCheck,
  CircleCross,
  CircleInfo,
  ListCheck,
  PiggyBank,
  Warning,
} from '../components/icons';

import './home.css';

type ActionItem = {
  icon: React.ReactNode;
  label: string;
  indicator: 'accent';
};

type TransmissionItem = {
  icon: React.ReactNode;
  label: string;
  count: number;
  pill: 'positive' | 'accent' | 'negative' | 'warning';
};

type BalanceItem = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const currencyCodes = ['AUD', 'USD', 'EUR', 'GBP'] as const;

const Home: React.FC = () => {
  const history = useHistory();
  const { mode, toggleMode } = useSaltTheme();
  const [currency, setCurrency] = useState<(typeof currencyCodes)[number]>('AUD');

  const balance = useMemo(
    () => ({
      current: { label: 'Current day', value: '134 519 621', decimals: '.76' },
      prior: { label: 'Prior day', value: '134 520 621', decimals: '.76' },
      credits: '1 000.00',
      debits: '(2 000.00)',
    }),
    [],
  );

  const actionItems = useMemo<ActionItem[]>(
    () => [
      { icon: <Check size={24} className="salt-home-inline-icon" />, label: 'Approve payment', indicator: 'accent' },
      { icon: <ListCheck size={24} className="salt-home-inline-icon" />, label: 'Release payment', indicator: 'accent' },
    ],
    [],
  );

  const transmissionItems = useMemo<TransmissionItem[]>(
    () => [
      { icon: <CircleCheck size={24} color="var(--salt-status-success-foreground)" className="salt-home-inline-icon" />, label: 'Sent for processing', count: 2, pill: 'accent' },
      { icon: <CircleInfo size={24} color="var(--salt-status-info-foreground)" className="salt-home-inline-icon" />, label: 'In process', count: 1, pill: 'accent' },
      { icon: <CircleCross size={24} color="var(--salt-status-error-foreground)" className="salt-home-inline-icon" />, label: 'Failed', count: 5, pill: 'accent' },
      { icon: <CircleInfo size={24} color="var(--salt-status-warning-foreground)" className="salt-home-inline-icon" />, label: 'Pending user actions', count: 4, pill: 'accent' },
    ],
    [],
  );

  const balanceItems = useMemo<BalanceItem[]>(
    () => [
      { icon: <PiggyBank size={24} className="salt-home-inline-icon" />, label: 'Credits', value: balance.credits },
      { icon: <Cash size={24} className="salt-home-inline-icon" />, label: 'Debits', value: balance.debits },
    ],
    [balance.credits, balance.debits],
  );

  const handleCaptureDeposit = () => {
    history.push('/deposit-to');
  };

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-home-toolbar">
          <div className="salt-home-toolbar-content">
            <Text styleAs="h4" className="salt-home-toolbar-title">
              Welcome, Gavin.
            </Text>
            <div className="salt-home-header-actions">
              <Button
                appearance="transparent"
                sentiment="neutral"
                className="salt-home-mode-toggle"
                onClick={toggleMode}
              >
                {mode === 'light' ? 'Dark mode' : 'Light mode'}
              </Button>
              <Button
                appearance="transparent"
                sentiment="neutral"
                className="salt-home-notification-button"
                aria-label="Alerts"
              >
                <span className="salt-home-notification-dot" />
                <Alert size={20} className="salt-home-alert-icon" />
              </Button>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-home-shell">
          <StackLayout className="salt-home-content" gap={1}>
            <Card className="salt-home-card">
              <StackLayout gap={0} className="salt-card-section">
                <FlexLayout align="start" justify="space-between" className="salt-card-section-top-row">
                  <StackLayout gap={0.2}>
                    <Text styleAs="label">
                      {balance.current.label}
                    </Text>
                    <div className="salt-home-amount">
                      <Text className="salt-home-current-amount-value">
                        {balance.current.value}
                      </Text>
                      <Text className="salt-home-current-amount-decimals">
                        {balance.current.decimals}
                      </Text>
                    </div>
                  </StackLayout>

                  <Dropdown
                    className="salt-home-currency-dropdown"
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

                <StackLayout gap={0.2} className="salt-home-prior-balance">
                  <Text styleAs="label">
                    {balance.prior.label}
                  </Text>
                    <div className="salt-home-amount">
                      <Text className="salt-home-prior-amount-value">
                        {balance.prior.value}
                      </Text>
                      <Text className="salt-home-prior-amount-decimals">
                        {balance.prior.decimals}
                      </Text>
                    </div>
                </StackLayout>

                {balanceItems.map(item => (
                  <div key={item.label} className="salt-home-balance-summary">
                    <FlexLayout align="center" justify="space-between" className="salt-home-balance-row">
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

            <Card className="salt-home-card">
              <StackLayout gap={0} className="salt-card-section">
                {actionItems.map(item => (
                  <FlexLayout key={item.label} align="center" justify="space-between" className="salt-home-row">
                    <FlexLayout align="center" gap={1}>
                      {item.icon}
                      <Text styleAs="label">{item.label}</Text>
                    </FlexLayout>
                    <span className={`salt-home-dot salt-home-dot--${item.indicator}`} />
                  </FlexLayout>
                ))}
              </StackLayout>
            </Card>


            <Card className="salt-home-card">
              <StackLayout gap={0} className="salt-card-section">
              <FlexLayout key="txms" align="center" justify="space-between" className="salt-home-row">
                    <FlexLayout align="center" gap={2}>
                      <Text styleAs="label">File Transmissions</Text>
                    </FlexLayout>
                  </FlexLayout>

                {transmissionItems.map(item => (
                  <FlexLayout key={item.label} align="center" justify="space-between" className="salt-home-row">
                    <FlexLayout align="center" gap={1}>
                      {item.icon}
                      <Text styleAs="label">{item.label}</Text>
                    </FlexLayout>
                    <div className={`salt-home-pill salt-home-pill--${item.pill}`}>{item.count}</div>
                    </FlexLayout>
                ))}
              </StackLayout>
            </Card>

          </StackLayout>
        </div>
        <div className="salt-home-fab">
          <Button
            appearance="solid"
            sentiment="accented"
            className="salt-home-primary-action"
            onClick={handleCaptureDeposit}
          >
            <Camera size={28} />
            Capture deposit
          </Button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
