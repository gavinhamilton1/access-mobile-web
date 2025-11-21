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
                Profile
              </Text>
              </div>
              <div className="salt-toolbar-column-right">
              </div>
            </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content-wide" gap={2}>


            <StackLayout gap={0} className="salt-list">

              <div className="salt-list-item-blank">
                <FlexLayout align="start" justify="start" gap={1}>
                    <ProfileIcon size={32} className="salt-inline-icon"/>
                    <StackLayout gap={0.2}>
                      <Text styleAs="h4">test mobile</Text>
                      <Text styleAs="label">Corporate banking</Text>
                    </StackLayout>
                </FlexLayout>
              </div>
              
              {navigationOptions.map(option => (
                <div key={option.label} className="salt-list-item">
                    <FlexLayout align="start" justify="space-between" className="salt-list-item-content" gap={2}>
                    {option.icon}
                    <Text styleAs="h4" style={{ flex: 1 }}>{option.label}</Text>
                    <ArrowForward size={20} className="salt-inline-icon" color="var(--salt-content-secondary-foreground)" />
                  </FlexLayout>
                </div>
              ))}
            </StackLayout>


            <div className="salt-list-item-blank">
                <StackLayout gap={1}>
                  <Text styleAs="label" style={{ textAlign: 'center', color: 'var(--salt-content-secondary-foreground)' }}>
                    Last login · 24-Oct-25 at 9:41 PM
                  </Text>
                  <StackLayout gap={1} className="salt-action-bar-buttons">
                    <Button
                      className="salt-action-bar-button"
                      appearance="bordered"
                      sentiment="neutral"
                      onClick={() => console.log('Give feedback')}
                    >
                      <Text styleAs="label">Give feedback</Text>
                    </Button>
                    <Button
                      className="salt-action-bar-button"
                      appearance="solid"
                      sentiment="accented"
                      onClick={() => console.log('Log out')}
                    >
                      <Text styleAs="label">Log out</Text>
                    </Button>
                  </StackLayout>
                </StackLayout>

            </div>




          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
