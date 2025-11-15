import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { ArrowForward } from '../components/icons';
import './home.css';

type DailySummaryItem = {
  id: string;
  date: string;
  depositsCount: number;
  totalValue: string;
};

const mockDailyData: DailySummaryItem[] = [
  { id: '1', date: '10/15/25', depositsCount: 0, totalValue: '$0,00' },
  { id: '2', date: '10/14/25', depositsCount: 0, totalValue: '$0,00' },
  { id: '3', date: '10/13/25', depositsCount: 1, totalValue: '$10,11' },
  { id: '4', date: '10/12/25', depositsCount: 0, totalValue: '$0,00' },
  { id: '5', date: '10/11/25', depositsCount: 2, totalValue: '$388,12' },
  { id: '6', date: '10/10/25', depositsCount: 1, totalValue: '$2,00' },
  { id: '7', date: '10/09/25', depositsCount: 0, totalValue: '$0,00' },
  { id: '8', date: '10/08/25', depositsCount: 0, totalValue: '$0,00' },
  { id: '9', date: '10/07/25', depositsCount: 0, totalValue: '$0,00' },
];

const DailySummary: React.FC = () => {
  const history = useHistory();

  const handleBack = () => history.goBack();
  const handleDayClick = (item: DailySummaryItem) => {
    console.log('Navigate to day details:', item.date);
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
                Daily summary
              </Text>
            </div>
            <div className="salt-header-right" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={1}>
            {mockDailyData.map(item => (
              <Card
                key={item.id}
                className="salt-card"
                onClick={() => handleDayClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <FlexLayout align="center" justify="space-between" gap={2} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150)' }}>
                  <StackLayout gap={0.2}>
                    <Text styleAs="label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Deposits
                    </Text>
                    <Text styleAs="h3">{item.depositsCount}</Text>
                  </StackLayout>
                  <StackLayout gap={0.2} align="center">
                    <Text styleAs="label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total value
                    </Text>
                    <Text styleAs="h3">{item.totalValue}</Text>
                  </StackLayout>
                  <FlexLayout align="center" gap={2}>
                    <StackLayout gap={0.2} align="end">
                      <Text styleAs="label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Date
                      </Text>
                      <Text styleAs="h4">{item.date}</Text>
                    </StackLayout>
                    <ArrowForward size={20} className="salt-inline-icon" color="var(--salt-content-secondary-foreground)" />
                  </FlexLayout>
                </FlexLayout>
              </Card>
            ))}
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DailySummary;
