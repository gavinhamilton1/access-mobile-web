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
      icon: <DepositsIcon size={32} className="salt-inline-icon" color="#87CEEB" />,
      action: '/capture-history',
    },
    {
      label: 'Daily summary',
      description: 'See an overview of the deposits you made over the last two weeks.',
      icon: <List size={32} className="salt-inline-icon" color="#87CEEB" />,
      action: '/daily-summary',
    },
    {
      label: 'Remote capture',
      description: 'Deposit checks and documents to your account.',
      icon: <Camera size={32} className="salt-inline-icon" color="#87CEEB" />,
      action: '/deposit-to',
    },
  ];

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          <div className="salt-toolbar-content">
            <div className="salt-header-left" />
            <div className="salt-header-center">
              <Text 
                styleAs="h4" 
                className="salt-toolbar-title"
                style={{ paddingTop: 'var(--salt-spacing-200)' }}
              >
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
                style={{ cursor: 'pointer', backgroundColor: 'black' }}
              >
                <StackLayout 
                  align="center" 
                  gap={1} 
                  className="salt-card-section" 
                  style={{ 
                    padding: 'var(--salt-spacing-200)',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                  }}>
                    {option.icon}
                  </div>
                  <StackLayout gap={0.2} style={{ alignItems: 'center', textAlign: 'center' }}>
                    <Text styleAs="h4">{option.label}</Text>
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
