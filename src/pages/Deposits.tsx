import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { ArrowForward, Camera, Deposits as DepositsIcon, List } from '../components/icons';
import './home.css';

const depositsOptions = [
  {
    label: 'Capture history',
    description: 'View a history of your deposits.',
    icon: <DepositsIcon size={24} className="salt-inline-icon" />,
    action: '/capture-history',
  },
  {
    label: 'Daily summary',
    description: 'See an overview of the deposits you made over the last two weeks.',
    icon: <List size={24} className="salt-inline-icon" />,
    action: '/daily-summary',
  },
  {
    label: 'Remote capture',
    description: 'Deposit checks and documents to your account.',
    icon: <Camera size={24} className="salt-inline-icon" />,
    action: '/deposit-to',
  },
];

const Deposits: React.FC = () => {
  const history = useHistory();

  const navigateTo = (path: string) => () => history.push(path);

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          <div className="salt-toolbar-content">
            <div className="salt-header-left" />
            <div className="salt-header-center">
              <Text styleAs="h4" className="salt-toolbar-title">
                Remote capture
              </Text>
            </div>
            <div className="salt-header-right" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={1}>
            {depositsOptions.map(option => (
              <Card
                key={option.label}
                className="salt-card"
                onClick={navigateTo(option.action)}
                style={{ cursor: 'pointer' }}
              >
                <FlexLayout align="center" gap={2} className="salt-card-section" style={{ padding: 'var(--salt-spacing-200)' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '999px', 
                    background: 'var(--salt-status-success-background)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <div style={{ color: 'var(--salt-status-success-foreground)' }}>
                      {option.icon}
                    </div>
                  </div>
                  <StackLayout gap={0.2} style={{ flex: 1 }}>
                    <Text styleAs="h4">{option.label}</Text>
                    <Text styleAs="label">{option.description}</Text>
                  </StackLayout>
                  <ArrowForward size={20} className="salt-inline-icon" color="var(--salt-content-secondary-foreground)" />
                </FlexLayout>
              </Card>
            ))}
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Deposits;
