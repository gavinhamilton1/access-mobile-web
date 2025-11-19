import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonAlert, IonSpinner } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation } from 'react-router-dom';
import { ArrowBack } from '../components/icons';
import './home.css';

type PaymentSelection = {
  id: string;
  from: string;
  type: string;
  amount: string;
};

interface LocationState {
  selectedItems?: PaymentSelection[];
  actionType?: 'approve' | 'release';
}

const ApproveRelease: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<PaymentSelection[]>([]);
  const [actionType, setActionType] = useState<'approve' | 'release'>('approve');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    const state = location.state as LocationState;

    if (state?.selectedItems) {
      setSelectedItems(state.selectedItems);
    }
    if (state?.actionType) {
      setActionType(state.actionType);
    }

    return () => clearTimeout(timer);
  }, [location.state]);

  const handleConfirm = () => setShowAlert(true);

  const handleAlertDismiss = () => {
    setShowAlert(false);
    history.goBack();
  };

  const handleCancel = () => history.goBack();

  const titleText = actionType === 'approve' ? 'Approve' : 'Release';

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
                  onClick={handleCancel}
                  style={{ padding: `0 var(--salt-spacing-100)` }}
                >
                  <ArrowBack size={18} className="salt-inline-icon" />
                </Button>
              </div>
              <div className="salt-toolbar-column-center">
                <Text styleAs="h4" className="salt-toolbar-title">
                {titleText}
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
            {isLoading ? (
              <Card className="salt-card">
                <div className="salt-card-section" style={{ padding: 'var(--salt-spacing-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '192px' }}>
                  <IonSpinner name="crescent" />
                </div>
              </Card>
            ) : selectedItems.length > 0 ? (
              selectedItems.map(item => (
                <Card key={item.id} className="salt-card">
                  <FlexLayout align="start" justify="space-between" gap={2} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150)' }}>
                    <StackLayout gap={0.2}>
                      <Text styleAs="h4" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {item.id}
                      </Text>
                      <Text styleAs="label" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {item.from}
                      </Text>
                    </StackLayout>
                    <StackLayout gap={0.2} align="end">
                      <Text styleAs="label">{item.type}</Text>
                      <Text styleAs="h4">{item.amount}</Text>
                    </StackLayout>
                  </FlexLayout>
                </Card>
              ))
            ) : (
              <Card className="salt-card">
                <div className="salt-card-section" style={{ padding: 'var(--salt-spacing-300)', textAlign: 'center' }}>
                  <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                    No payments selected.
                  </Text>
                </div>
              </Card>
            )}
          </StackLayout>
        </div>

        <div className="salt-action-bar">
          <div style={{ padding: 'var(--salt-spacing-150)' }}>
            <Button
              appearance="solid"
              sentiment="accented"
              onClick={handleConfirm}
              disabled={isLoading || selectedItems.length === 0}
              style={{ borderRadius: '999px', width: '100%' }}
            >
              <Text styleAs="label">Confirm</Text>
            </Button>
          </div>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={handleAlertDismiss}
        header="Confirmation"
        message={`${titleText} confirmed`}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default ApproveRelease;
