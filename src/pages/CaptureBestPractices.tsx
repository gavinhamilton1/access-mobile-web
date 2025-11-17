import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation } from 'react-router-dom';
import { ArrowBack, Camera } from '../components/icons';
import './home.css';

interface LocationState {
  captureType?: string;
  selectedGroup?: string;
  selectedProgram?: string;
  programName?: string;
}

const tips = [
  {
    title: 'Dark or mostly monochrome background',
    description:
      'Use a uniform, darker background—especially when the check itself is light colored.',
  },
  {
    title: 'Photograph the physical check',
    description: 'Avoid capturing screenshots or photocopies; always use the original document.',
  },
  {
    title: 'Stick to auto capture',
    description: 'Auto captured checks satisfy deposit criteria more reliably than manual shots.',
  },
  {
    title: 'Limit excessive angles',
    description: 'Hold the camera directly above the check without casting shadows.',
  },
];

const CaptureBestPractices: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const captureType = state?.captureType || 'Check and document(s)';
  const selectedGroup = state?.selectedGroup || '';
  const selectedProgram = state?.selectedProgram || '15501';
  const programName = state?.programName || 'AUTOAL1 RDC PROGRAM 1 GROUPS';

  const handleBack = () => history.goBack();

  const handleStartCapture = () => {
    history.push('/deposits/capture-check', {
      captureType,
      selectedGroup,
      selectedProgram,
      programName,
    });
  };

  const handleDoNotShowAgain = () => {
    console.log('Do not show again');
    history.goBack();
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
                <ArrowBack size={18} className="salt-inline-icon" />
              </Button>
            </div>
            <div className="salt-header-center">
              <Text styleAs="h4" className="salt-toolbar-title">
                Remote capture tips
              </Text>
            </div>
            <div className="salt-header-right" />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={2} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100%', paddingTop: 'var(--salt-spacing-300)' }}>
            <Card className="salt-card" style={{ maxWidth: '512px', width: '100%' }}>
              <StackLayout gap={2} className="salt-card-section" style={{ padding: 'var(--salt-spacing-300)' }}>
                <FlexLayout align="center" justify="center">
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '999px', 
                    background: 'var(--salt-status-success-background)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                  }}>
                    <Camera size={32} className="salt-inline-icon" color="var(--salt-status-success-foreground)" />
                  </div>
                </FlexLayout>

                <Text styleAs="h2" style={{ textAlign: 'center' }}>
                  Remote capture best practices
                </Text>

                <StackLayout gap={1}>
                  {tips.map(tip => (
                    <Card key={tip.title} className="salt-card" style={{ background: 'var(--salt-container-secondary-background)' }}>
                      <StackLayout gap={0.5} className="salt-card-section" style={{ padding: 'var(--salt-spacing-200)', textAlign: 'center' }}>
                        <Text styleAs="h4">{tip.title}</Text>
                        <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                          {tip.description}
                        </Text>
                      </StackLayout>
                    </Card>
                  ))}
                </StackLayout>

                <StackLayout gap={1}>
                  <Button
                    appearance="solid"
                    sentiment="accented"
                    onClick={handleStartCapture}
                    style={{ borderRadius: '999px', width: '100%' }}
                  >
                    <Text styleAs="label">Start capture</Text>
                  </Button>
                  <Button
                    appearance="transparent"
                    sentiment="neutral"
                    onClick={handleDoNotShowAgain}
                    style={{ width: '100%', textDecoration: 'underline' }}
                  >
                    <Text styleAs="label">Do not show again</Text>
                  </Button>
                </StackLayout>
              </StackLayout>
            </Card>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CaptureBestPractices;
