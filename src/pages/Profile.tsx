import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { Alert, Apps, ArrowForward, Phone, Profile as ProfileIcon, Settings } from '../components/icons';
import './home.css';

const Profile: React.FC = () => {
  const history = useHistory();

  const navigationOptions = [
    { label: 'Settings', icon: <Settings size={20} className="salt-inline-icon" />, action: () => console.log('Navigate to Settings') },
    { label: 'Support', icon: <Phone size={20} className="salt-inline-icon" />, action: () => console.log('Navigate to Support') },
    { label: 'Notifications', icon: <Alert size={20} className="salt-inline-icon" />, action: () => console.log('Navigate to Notifications') },
    { label: 'App Experience', icon: <Apps size={20} className="salt-inline-icon" />, action: () => history.push('/app-experience') },
  ];

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          <div className="salt-toolbar-content">
            <div className="salt-header-left" />
            <div className="salt-header-center">
              <Text styleAs="h4" className="salt-toolbar-title">
                Profile
              </Text>
            </div>
            <div className="salt-header-right" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={2}>
            <Card className="salt-card">
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
                  <ProfileIcon size={24} className="salt-inline-icon" color="var(--salt-status-success-foreground)" />
                </div>
                <StackLayout gap={0.2}>
                  <Text styleAs="h4">test mobile</Text>
                  <Text styleAs="label">Corporate banking</Text>
                </StackLayout>
              </FlexLayout>
            </Card>

            <StackLayout gap={1}>
              {navigationOptions.map(option => (
                <Card
                  key={option.label}
                  className="salt-card"
                  onClick={option.action}
                  style={{ cursor: 'pointer' }}
                >
                  <FlexLayout align="center" gap={2} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150)' }}>
                    {option.icon}
                    <Text styleAs="h4" style={{ flex: 1 }}>{option.label}</Text>
                    <ArrowForward size={20} className="salt-inline-icon" color="var(--salt-content-secondary-foreground)" />
                  </FlexLayout>
                </Card>
              ))}
            </StackLayout>

            <Text styleAs="label" style={{ textAlign: 'center', color: 'var(--salt-content-secondary-foreground)' }}>
              Last login · 24-Oct-25 at 9:41 PM
            </Text>

            <StackLayout gap={1}>
              <Button
                appearance="bordered"
                sentiment="neutral"
                onClick={() => console.log('Give feedback')}
                style={{ borderRadius: '999px', width: '100%' }}
              >
                <Text styleAs="label">Give feedback</Text>
              </Button>
              <Button
                appearance="solid"
                sentiment="neutral"
                onClick={() => console.log('Log out')}
                style={{ borderRadius: '999px', width: '100%' }}
              >
                <Text styleAs="label">Log out</Text>
              </Button>
            </StackLayout>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
