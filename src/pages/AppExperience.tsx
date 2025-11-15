import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { AccessLineLogo, DigitalBankingLineLogo } from '../components/icons';
import './home.css';

const experiences = [
  {
    label: 'Access',
    icon: <AccessLineLogo size={96} className="salt-inline-icon" />,
    action: (history: ReturnType<typeof useHistory>) => history.push('/home'),
  },
  {
    label: 'Digital Banking',
    icon: <DigitalBankingLineLogo size={96} className="salt-inline-icon" />,
    action: () => (window.location.href = 'https://digital-banking-fac4.onrender.com/'),
  },
];

const AppExperience: React.FC = () => {
  const history = useHistory();

  const handleBack = () => history.goBack();

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
                App experience
              </Text>
            </div>
            <div className="salt-header-right" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={2} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100%', paddingTop: 'var(--salt-spacing-300)' }}>
            <StackLayout gap={0.5} style={{ textAlign: 'center' }}>
              <Text styleAs="h2">J.P. Morgan Payments</Text>
              <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                Choose your experience
              </Text>
            </StackLayout>

            <FlexLayout align="center" justify="center" gap={2} style={{ flexWrap: 'wrap' }}>
              {experiences.map(exp => (
                <Card
                  key={exp.label}
                  className="salt-card"
                  onClick={() => exp.action(history)}
                  style={{ cursor: 'pointer', width: '160px', padding: 'var(--salt-spacing-200)' }}
                >
                  <StackLayout gap={1} align="center" className="salt-card-section" style={{ padding: 'var(--salt-spacing-200)' }}>
                    <div style={{ 
                      width: '96px', 
                      height: '96px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                    }}>
                      {exp.icon}
                    </div>
                    <Text styleAs="h4" style={{ color: 'var(--salt-accent-foreground)' }}>
                      {exp.label}
                    </Text>
                  </StackLayout>
                </Card>
              ))}
            </FlexLayout>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AppExperience;
