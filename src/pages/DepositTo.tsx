import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, Card, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { ArrowBack, ArrowForward, Search } from '../components/icons';
import { programsData } from '../data/programsData';
import './home.css';

const DepositTo: React.FC = () => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const handleBack = () => history.goBack();
  const handleCancel = () => history.push('/deposits');

  const handleProgramSelect = (programId: string) => {
    const program = programsData.find(p => p.id === programId);
    history.push('/deposits/remote-capture-type', {
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
                Deposit to
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

            <StackLayout gap={0.7}>
              {filteredPrograms.map(program => (
                <Card
                  key={program.id}
                  className="salt-card"
                  onClick={() => handleProgramSelect(program.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <FlexLayout align="center" justify="space-between" gap={0} className="salt-card-section-condensed">
                    <StackLayout gap={0}>
                      <Text styleAs="label">{program.name}</Text>
                      <Text styleAs="label">Program {program.id}</Text>
                    </StackLayout>
                    <FlexLayout align="center" gap={0.5}>
                      <ArrowForward size={20} className="salt-inline-icon" color="var(--salt-content-secondary-foreground)" />
                    </FlexLayout>
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
