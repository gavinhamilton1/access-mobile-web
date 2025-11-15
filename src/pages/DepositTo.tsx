import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { ArrowForward, Search } from '../components/icons';
import './home.css';

const programsData = [
  { id: '15501', name: 'AUTOAL1 RDC PROGRAM 1 GROUPS' },
  { id: '15502', name: 'AUTOAL1 RDC PROGRAM 2 OPT REF ITEMS' },
  { id: '15503', name: 'AUTOAL1 RDC PROGRAM 3 REQ REF ITEMS' },
  { id: '15504', name: 'AUTOAL1 RDC PROGRAM 4 OPT REF ITEMS' },
  { id: '15505', name: 'AUTOAL1 RDC PROGRAM 5 NO REF ITEMS' },
  { id: '931503601', name: 'CAD PROGRAM CA/CAD' },
  { id: '931503602', name: 'CAD PROGRAM CA/USD' },
];

const DepositTo: React.FC = () => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const handleBack = () => history.goBack();
  const handleCancel = () => history.push('/deposits');

  const handleProgramSelect = (programId: string) => {
    const program = programsData.find(p => p.id === programId);
    history.push('/remote-capture-type', {
      selectedProgram: programId,
      programName: program?.name || '',
    });
  };

  const filteredPrograms = programsData.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.id.toLowerCase().includes(searchTerm.toLowerCase())
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
                Deposit to
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
            <FlexLayout align="center" gap={1} className="salt-search-input">
              <Search size={20} className="salt-icon-subtle salt-inline-icon" />
              <input
                type="search"
                placeholder="Search programs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
            </FlexLayout>

            <StackLayout gap={1}>
              {filteredPrograms.map(program => (
                <Card
                  key={program.id}
                  className="salt-card"
                  onClick={() => handleProgramSelect(program.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <FlexLayout align="center" justify="space-between" gap={2} className="salt-card-section" style={{ padding: 'var(--salt-spacing-200)' }}>
                    <StackLayout gap={0.2}>
                      <Text styleAs="h4">{program.name}</Text>
                      <Text styleAs="label">Program {program.id}</Text>
                    </StackLayout>
                    <ArrowForward size={20} className="salt-inline-icon" color="var(--salt-content-secondary-foreground)" />
                  </FlexLayout>
                </Card>
              ))}

              {filteredPrograms.length === 0 && (
                <Card className="salt-card">
                  <div className="salt-card-section" style={{ padding: 'var(--salt-spacing-300)', textAlign: 'center' }}>
                    <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                      No programs match that search.
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

export default DepositTo;
