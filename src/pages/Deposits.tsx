import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Card, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { Camera, Deposits as DepositsIcon, List } from '../components/icons';
import './home.css';

const Deposits: React.FC = () => {
  const history = useHistory();

  const navigateTo = (path: string) => () => history.push(path);

  const depositsOptions = [
    {
      label: 'Capture history',
      description: 'View a history of your deposits.',
      icon: <DepositsIcon size={32} className="salt-inline-icon"/>,
      action: '/deposits/capture-history',
    },
    {
      label: 'Daily summary',
      description: 'See an overview of the deposits you made over the last two weeks.',
      icon: <List size={32} className="salt-inline-icon"/>,
      action: '/deposits/daily-summary',
    },
    {
      label: 'Remote capture',
      description: 'Deposit checks and documents to your account.',
      icon: <Camera size={32} className="salt-inline-icon"/>,
      action: '/deposits/deposit-to',
    },
  ];

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
        <div className="salt-toolbar-3column">
              <div className="salt-toolbar-column-left">
              </div>
              <div className="salt-toolbar-column-center">
              <Text styleAs="h4" className="salt-toolbar-title">
                Remote capture
              </Text>
              </div>
              <div className="salt-toolbar-column-right">
              </div>
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
                <StackLayout 
                  align="center" 
                  gap={1} 
                  className="salt-card-section" 
                  style={{ 
                    padding: 'var(--salt-spacing-150)',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--salt-deposit-icon-color)',
                  }}>
                    {option.icon}
                  </div>
                  <StackLayout gap={0.2} style={{ alignItems: 'center', textAlign: 'center' }}>
                    <Text styleAs="h4" style={{ fontSize: '1.5rem', fontWeight: 400, paddingBottom: 'var(--salt-spacing-100)' }}>{option.label}</Text>
                    <Text styleAs="label">{option.description}</Text>
                  </StackLayout>
                </StackLayout>
              </Card>
            ))}
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Deposits;
