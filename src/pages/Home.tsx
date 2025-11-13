import React, { useMemo, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, Dropdown, FlexLayout, Option, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';

import { useSaltTheme } from '../theme/SaltThemeProvider';

import './home.css';

type ActionItem = {
  icon: string;
  label: string;
  indicator: 'accent';
};

type TransmissionItem = {
  icon: string;
  label: string;
  count: number;
  pill: 'positive' | 'accent' | 'negative' | 'warning';
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
      { icon: '/images/Check.svg', label: 'Approve payment', indicator: 'accent' },
      { icon: '/images/ListCheck.svg', label: 'Release payment', indicator: 'accent' },
    ],
    [],
  );

  const transmissionItems = useMemo<TransmissionItem[]>(
    () => [
      { icon: '/images/CircleCheck.svg', label: 'Sent for processing', count: 2, pill: 'positive' },
      { icon: '/images/CircleInfo.svg', label: 'In process', count: 1, pill: 'accent' },
      { icon: '/images/CircleCross.svg', label: 'Failed', count: 5, pill: 'negative' },
      { icon: '/images/Warning.svg', label: 'Pending user actions', count: 4, pill: 'warning' },
    ],
    [],
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
                <img src="/images/Alert.svg" alt="" className="salt-home-alert-icon" />
              </Button>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-home-shell">
          <StackLayout className="salt-home-content" gap={2}>
            <Card className="salt-home-card salt-home-balance-card">
              <StackLayout gap={3}>
                <FlexLayout align="start" justify="space-between">
                  <StackLayout gap={1}>
                    <Text styleAs="label" className="salt-home-section-label">
                      {balance.current.label}
                    </Text>
                    <div className="salt-home-amount">
                      <Text styleAs="h3">
                        {balance.current.value}
                      </Text>
                      <Text as="span" styleAs="h4">
                        {balance.current.decimals}
                      </Text>
                    </div>
                  </StackLayout>

                  <Dropdown
                    className="salt-home-currency-dropdown"
                    style={{ minWidth: '4.5rem' }}
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

                <StackLayout gap={1}>
                  <Text styleAs="label" className="salt-home-section-label">
                    {balance.prior.label}
                  </Text>
                  <div className="salt-home-amount">
                    <Text styleAs="display3">{balance.prior.value}</Text>
                    <Text as="span" styleAs="display4" className="salt-home-amount-decimals">
                      {balance.prior.decimals}
                    </Text>
                  </div>
                </StackLayout>

                <StackLayout gap={1} className="salt-home-balance-summary">
                  <FlexLayout align="center" justify="space-between">
                    <FlexLayout align="center" gap={2}>
                      <img src="/images/PiggyBank.svg" alt="Credits" className="salt-home-inline-icon" />
                      <Text styleAs="action">Credits</Text>
                    </FlexLayout>
                    <Text styleAs="action" className="salt-home-number-positive">
                      {balance.credits}
                    </Text>
                  </FlexLayout>
                  <FlexLayout align="center" justify="space-between">
                    <FlexLayout align="center" gap={2}>
                      <img src="/images/VisibilityOn.svg" alt="Debits" className="salt-home-inline-icon" />
                      <Text styleAs="action">Debits</Text>
                    </FlexLayout>
                    <Text styleAs="action" className="salt-home-number-negative">
                      {balance.debits}
                    </Text>
                  </FlexLayout>
                </StackLayout>
              </StackLayout>
            </Card>

            <Card className="salt-home-card salt-home-action-card">
              <StackLayout gap={2}>
                {actionItems.map(item => (
                  <FlexLayout key={item.label} align="center" justify="space-between" className="salt-home-row">
                    <FlexLayout align="center" gap={2}>
                      <img src={item.icon} alt={item.label} className="salt-home-inline-icon" />
                      <Text styleAs="action">{item.label}</Text>
                    </FlexLayout>
                    <span className={`salt-home-dot salt-home-dot--${item.indicator}`} />
                  </FlexLayout>
                ))}
              </StackLayout>
            </Card>

            <Card className="salt-home-card salt-home-transmission-card">
              <StackLayout gap={3}>
                <Text styleAs="h4" className="salt-home-card-heading">
                  File Transmissions
                </Text>
                <StackLayout gap={2}>
                  {transmissionItems.map(item => (
                    <FlexLayout key={item.label} align="center" justify="space-between" className="salt-home-row">
                      <FlexLayout align="center" gap={2}>
                        <img src={item.icon} alt={item.label} className="salt-home-inline-icon" />
                        <Text styleAs="action">{item.label}</Text>
                      </FlexLayout>
                      <div className={`salt-home-pill salt-home-pill--${item.pill}`}>{item.count}</div>
                    </FlexLayout>
                  ))}
                </StackLayout>
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
            <img src="/images/Camera.svg" alt="" />
            Capture deposit
          </Button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
