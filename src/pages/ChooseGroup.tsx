import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation } from 'react-router-dom';
import { ArrowForward, Search } from '../components/icons';
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
    history.push('/choose-summary', {
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
                Choose a group
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
            <Card className="salt-card">
              <StackLayout gap={0.5} className="salt-card-section" style={{ padding: 'var(--salt-spacing-150)' }}>
                <Text styleAs="label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--salt-content-secondary-foreground)' }}>
                  Program
                </Text>
                <Text styleAs="h4">{programName || 'Program selection'}</Text>
                <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                  {selectedProgram || 'Choose a program to continue'}
                </Text>
              </StackLayout>
            </Card>

            <FlexLayout align="center" gap={1} className="salt-search-input">
              <Search size={20} className="salt-icon-subtle salt-inline-icon" />
              <input
                type="search"
                placeholder="Search groups"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
            </FlexLayout>

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
