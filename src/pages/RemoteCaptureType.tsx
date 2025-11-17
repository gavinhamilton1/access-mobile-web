import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation } from 'react-router-dom';
import { ArrowBack, ArrowForward } from '../components/icons';
import './home.css';

interface LocationState {
  selectedProgram?: string;
  programName?: string;
}

const captureOptions = [
  { label: 'Check and document(s)', value: 'Check and document(s)' },
  { label: 'Check only', value: 'Check only' },
  { label: 'Document(s) only', value: 'Document(s) only' },
];

const RemoteCaptureType: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const selectedProgram = state?.selectedProgram || '';
  const programName = state?.programName || '';

  const handleBack = () => history.goBack();
  const handleCancel = () => history.push('/deposits');

  const handleSelect = (captureType: string) => {
    history.push('/deposits/choose-group', {
      captureType,
      selectedProgram,
      programName,
    });
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
                  Choose capture type
                </Text>
              </div>
              <div className="salt-toolbar-column-right">
                <Button
                  appearance="transparent"
                  sentiment="neutral"
                  onClick={handleCancel}
                  style={{ padding: `0 var(--salt-spacing-100)` }}
                >
                  <Text styleAs="label">Cancel</Text>
                </Button>
              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={1}>
            <Card className="salt-card">
              <StackLayout gap={0.5} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150)' }}>
                <Text styleAs="label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--salt-content-secondary-foreground)' }}>
                  Program
                </Text>
                <Text styleAs="h4">{programName || 'Select a program'}</Text>
                <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                  {selectedProgram}
                </Text>
              </StackLayout>
            </Card>

            <StackLayout gap={1}>
              {captureOptions.map(option => (
                <Card
                  key={option.value}
                  className="salt-card"
                  onClick={() => handleSelect(option.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <FlexLayout align="center" justify="space-between" gap={2} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150) var(--salt-spacing-200)' }}>
                    <Text styleAs="h4">{option.label}</Text>
                    <ArrowForward size={20} className="salt-inline-icon" color="var(--salt-content-secondary-foreground)" />
                  </FlexLayout>
                </Card>
              ))}
            </StackLayout>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RemoteCaptureType;
