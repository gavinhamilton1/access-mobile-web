import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation } from 'react-router-dom';
import { ArrowBack, ArrowForward, Search } from '../components/icons';
import './home.css';

interface LocationState {
  captureType?: string;
  selectedProgram?: string;
  programName?: string;
}

const mockGroups = ['Tax Sales', 'Maintenance Orders', 'Store Receipts'];

const ChooseGroup: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [captureType, setCaptureType] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [programName, setProgramName] = useState('');

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.captureType) setCaptureType(state.captureType);
    if (state?.selectedProgram) setSelectedProgram(state.selectedProgram);
    if (state?.programName) setProgramName(state.programName);
  }, [location.state]);

  const handleBack = () => history.goBack();
  const handleCancel = () => history.push('/deposits');

  const handleGroupSelect = (groupName: string) => {
    history.push('/deposits/choose-summary', {
      captureType,
      selectedGroup: groupName,
      selectedProgram,
      programName,
    });
  };

  const filteredGroups = mockGroups.filter(group =>
    group.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  Choose a group
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
            <StackLayout gap={1}>
              {filteredGroups.map(group => (
                <Card
                  key={group}
                  className="salt-card"
                  onClick={() => handleGroupSelect(group)}
                  style={{ cursor: 'pointer' }}
                >
                  <FlexLayout align="center" justify="space-between" gap={2} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150) var(--salt-spacing-200)' }}>
                    <Text styleAs="h4">{group}</Text>
                    <ArrowForward size={20} className="salt-inline-icon" color="var(--salt-content-secondary-foreground)" />
                  </FlexLayout>
                </Card>
              ))}

              {filteredGroups.length === 0 && (
                <Card className="salt-card">
                  <div className="salt-card-section" style={{ padding: 'var(--salt-spacing-300)', textAlign: 'center' }}>
                    <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                      No groups match that search.
                    </Text>
                  </div>
                </Card>
              )}
            </StackLayout>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChooseGroup;
