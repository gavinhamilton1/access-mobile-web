import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation } from 'react-router-dom';
import { ArrowForward } from '../components/icons';
import './home.css';

interface LocationState {
  captureType?: string;
  selectedGroup?: string;
  selectedProgram?: string;
  programName?: string;
}

const ChooseSummary: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const captureType = state?.captureType || 'Check and document(s)';
  const selectedGroup = state?.selectedGroup || 'Maintenance Orders';
  const selectedProgram = state?.selectedProgram || '15501';
  const programName = state?.programName || 'AUTOAL1 RDC PROGRAM 1 GROUPS';

  const summaryOptions = [
    {
      label: 'Deposit to',
      value: `${selectedProgram} ${programName}`.trim(),
      action: () => history.push('/deposit-to'),
    },
    {
      label: 'Capture type',
      value: captureType,
      action: () => history.push('/remote-capture-type'),
    },
    {
      label: 'Group',
      value: selectedGroup,
      action: () => history.push('/choose-group', { captureType }),
    },
  ];

  const handleBack = () => history.goBack();
  const handleCancel = () => history.push('/deposits');
  const handleStartCapture = () => {
    history.push('/capture-best-practices', {
      captureType,
      selectedGroup,
      selectedProgram,
      programName,
    });
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
                Review selection
              </Text>
            </div>
            <div className="salt-header-right">
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
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={1}>
            {summaryOptions.map(option => (
              <Card
                key={option.label}
                className="salt-card"
                onClick={option.action}
                style={{ cursor: 'pointer' }}
              >
                <FlexLayout align="center" justify="space-between" gap={2} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150) var(--salt-spacing-200)' }}>
                  <StackLayout gap={0.2}>
                    <Text styleAs="label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--salt-content-secondary-foreground)' }}>
                      {option.label}
                    </Text>
                    <Text styleAs="h4">{option.value}</Text>
                  </StackLayout>
                  <ArrowForward size={20} className="salt-inline-icon" color="var(--salt-content-secondary-foreground)" />
                </FlexLayout>
              </Card>
            ))}

            <Button
              appearance="solid"
              sentiment="accented"
              onClick={handleStartCapture}
              style={{ borderRadius: '999px', width: '100%', marginTop: 'var(--salt-spacing-200)' }}
            >
              <Text styleAs="label">Continue</Text>
            </Button>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChooseSummary;
