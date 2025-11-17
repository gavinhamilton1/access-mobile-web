import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { ArrowBack, ArrowForward } from '../components/icons';
import { dailySummaryData, type DailySummaryItem } from '../data/dailySummaryData';
import './home.css';

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

          <div className="salt-toolbar-3column">
              <div className="salt-toolbar-column-left">
                <Button
                  appearance="transparent"
                  sentiment="neutral"
                  onClick={handleBack}
                  style={{ padding: `0 var(--salt-spacing-100)` }}
                >
                  <ArrowBack size={18} className="salt-inline-icon" />
                </Button>
              </div>
              <div className="salt-toolbar-column-center">
                <Text styleAs="h4" className="salt-toolbar-title">
                Daily summary
                </Text>
              </div>
              <div className="salt-toolbar-column-right">

              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={0.7}>
            {dailySummaryData.map(item => (
              <Card
                key={item.id}
                className="salt-card"
                onClick={() => handleDayClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <FlexLayout align="center" justify="space-between" gap={0} className="salt-card-section-condensed">
                  <StackLayout gap={0}>
                    <Text styleAs="label">
                      Deposits
                    </Text>
                    <Text styleAs="label">{item.depositsCount}</Text>
                  </StackLayout>
                  <StackLayout gap={0.2} align="center">
                    <Text styleAs="label">
                      Total value
                    </Text>
                    <Text styleAs="label">{item.currency} {item.totalValue}</Text>
                  </StackLayout>
                  <FlexLayout align="center" gap={0.5}>
                    <StackLayout gap={0.2} align="end">
                      <Text styleAs="label">{item.date}</Text>
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
