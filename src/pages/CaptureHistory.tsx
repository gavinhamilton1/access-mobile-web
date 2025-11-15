import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { Check, Search, Warning } from '../components/icons';
import './home.css';

type CaptureHistoryItem = {
  id: string;
  title: string;
  programNumber: string;
  amount: string;
  currency: string;
  status: 'action-required' | 'deposited';
  date: string;
};

const mockHistoryData: CaptureHistoryItem[] = [
  {
    id: '1',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '3 000 000,00',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '100 000,00',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-15',
  },
  {
    id: '3',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '25,00',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-15',
  },
  {
    id: '4',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '50,00',
    currency: 'USD',
    status: 'deposited',
    date: '2024-01-14',
  },
  {
    id: '5',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '75,00',
    currency: 'USD',
    status: 'deposited',
    date: '2024-01-14',
  },
  {
    id: '6',
    title: 'CAD PROGRAM CA/USD',
    programNumber: 'Program 931503602',
    amount: '80,12',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-13',
  },
  {
    id: '7',
    title: 'CAD PROGRAM CA/CAD',
    programNumber: 'Program 931503601',
    amount: '10,11',
    currency: 'CAD',
    status: 'action-required',
    date: '2024-01-13',
  },
  {
    id: '8',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '125,00',
    currency: 'USD',
    status: 'deposited',
    date: '2024-01-12',
  },
];

const CaptureHistory: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');

  const filteredData = mockHistoryData.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.programNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBack = () => history.goBack();

  const statusConfig: Record<CaptureHistoryItem['status'], { label: string; icon: React.ReactNode }> = {
    'action-required': {
      label: 'Action Required',
      icon: <Warning size={16} className="salt-inline-icon" color="var(--salt-status-warning-foreground)" />,
    },
    deposited: {
      label: 'Deposited',
      icon: <Check size={16} className="salt-inline-icon" color="var(--salt-status-success-foreground)" />,
    },
  };

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          <div className="salt-toolbar-content">
            <div className="salt-header-left">
              <Button
                appearance="transparent"
                sentiment="neutral"
                onClick={handleBack}
                style={{ padding: `0 var(--salt-spacing-100)` }}
              >
                <Text styleAs="label">Back</Text>
              </Button>
            </div>
            <div className="salt-header-center">
              <Text styleAs="h4" className="salt-toolbar-title">
                Capture history
              </Text>
            </div>
            <div className="salt-header-right" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={1}>
            <FlexLayout align="center" gap={1} className="salt-search-input">
              <Search size={20} className="salt-icon-subtle salt-inline-icon" />
              <input
                type="search"
                placeholder="Search history"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
            </FlexLayout>

            <StackLayout gap={1}>
              {filteredData.map(item => {
                const status = statusConfig[item.status];
                return (
                  <Card key={item.id} className="salt-card">
                    <StackLayout gap={1} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150)' }}>
                      <FlexLayout align="center" justify="space-between" gap={2}>
                        <StackLayout gap={0.2} style={{ flex: 1, minWidth: 0 }}>
                          <Text styleAs="h4" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {item.title}
                          </Text>
                          <Text styleAs="label">{item.programNumber}</Text>
                        </StackLayout>
                        <Text styleAs="h4">
                          {item.currency} {item.amount}
                        </Text>
                      </FlexLayout>

                      <FlexLayout align="center" justify="space-between">
                        <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)', fontSize: '0.75rem' }}>
                          {item.date}
                        </Text>
                        <FlexLayout align="center" gap={1} style={{
                          borderRadius: '999px',
                          padding: `var(--salt-spacing-50) var(--salt-spacing-150)`,
                          background: item.status === 'action-required' 
                            ? 'var(--salt-status-warning-background)' 
                            : 'var(--salt-status-success-background)',
                          color: item.status === 'action-required'
                            ? 'var(--salt-status-warning-foreground)'
                            : 'var(--salt-status-success-foreground)',
                        }}>
                          {status.icon}
                          <Text styleAs="label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                            {status.label}
                          </Text>
                        </FlexLayout>
                      </FlexLayout>
                    </StackLayout>
                  </Card>
                );
              })}

              {filteredData.length === 0 && (
                <Card className="salt-card">
                  <div className="salt-card-section" style={{ padding: 'var(--salt-spacing-300)', textAlign: 'center' }}>
                    <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                      No capture history matches your search.
                    </Text>
                  </div>
                </Card>
              )}
            </StackLayout>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CaptureHistory;
