import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation } from 'react-router-dom';
import { CircleCheck } from '../components/icons';
import './home.css';

interface LocationState {
  captureType?: string;
  selectedGroup?: string;
  selectedProgram?: string;
  programName?: string;
  amount?: string;
}

const DepositSuccess: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;

  const captureType = state?.captureType || 'Check and document(s)';
  const selectedGroup = state?.selectedGroup || 'Maintenance Orders';
  const selectedProgram = state?.selectedProgram || '15501';
  const programName = state?.programName || 'AUTOAL1 RDC PROGRAM 1 GROUPS';
  const amount = state?.amount || '3 000 000,00';

  const details = [
    { label: 'Deposited to', value: `${selectedProgram} ${programName}`.trim() },
    { label: 'Capture type', value: captureType },
    { label: 'Group', value: selectedGroup },
    { label: 'Amount', value: `USD ${amount}` },
  ];

  const handleDone = () => history.push('/deposits');
  const handleCaptureAnother = () => history.push('/deposit-to');

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          <div className="salt-toolbar-content">
            <div className="salt-header-left" />
            <div className="salt-header-center">
              <Text styleAs="h4" className="salt-toolbar-title">
                Deposit submitted
              </Text>
            </div>
            <div className="salt-header-right">
              <Button
                appearance="transparent"
                sentiment="neutral"
                onClick={handleDone}
                style={{ padding: `0 var(--salt-spacing-100)` }}
              >
                <Text styleAs="label">Done</Text>
              </Button>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content" gap={2} style={{ alignItems: 'center', paddingTop: 'var(--salt-spacing-300)' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '999px', 
              background: 'var(--salt-status-success-background)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
            }}>
              <CircleCheck size={40} className="salt-inline-icon" color="var(--salt-status-success-foreground)" />
            </div>
            
            <StackLayout gap={0.5} style={{ textAlign: 'center' }}>
              <Text styleAs="h2">Deposit submitted</Text>
              <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                We're processing your transaction now.
              </Text>
            </StackLayout>

            <StackLayout gap={1} style={{ width: '100%', maxWidth: '512px' }}>
              {details.map(detail => (
                <Card key={detail.label} className="salt-card">
                  <FlexLayout align="center" justify="space-between" gap={2} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150)' }}>
                    <Text styleAs="label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--salt-content-secondary-foreground)' }}>
                      {detail.label}
                    </Text>
                    <Text styleAs="h4" style={{ textAlign: 'right' }}>{detail.value}</Text>
                  </FlexLayout>
                </Card>
              ))}
            </StackLayout>

            <StackLayout gap={1} style={{ width: '100%', maxWidth: '512px', marginTop: 'var(--salt-spacing-300)' }}>
              <Button
                appearance="bordered"
                sentiment="neutral"
                onClick={handleCaptureAnother}
                style={{ borderRadius: '999px', width: '100%' }}
              >
                <Text styleAs="label">Capture another transaction</Text>
              </Button>
              <Button
                appearance="solid"
                sentiment="accented"
                onClick={handleDone}
                style={{ borderRadius: '999px', width: '100%' }}
              >
                <Text styleAs="label">Back to deposits</Text>
              </Button>
            </StackLayout>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DepositSuccess;
