import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonInput,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const DepositTo: React.FC = () => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  // Program data matching the image description
  const programsData = [
    { id: '15501', name: 'AUTOAL1 RDC PROGRAM 1 GROUPS' },
    { id: '15502', name: 'AUTOAL1 RDC PROGRAM 2 OPT REF ITEMS' },
    { id: '15503', name: 'AUTOAL1 RDC PROGRAM 3 REQ REF ITEMS' },
    { id: '15504', name: 'AUTOAL1 RDC PROGRAM 4 OPT REF ITEMS' },
    { id: '15505', name: 'AUTOAL1 RDC PROGRAM 5 NO REF ITEMS' },
    { id: '931503601', name: 'CAD PROGRAM CA/CAD' },
    { id: '931503602', name: 'CAD PROGRAM CA/USD' }
  ];

  const handleBack = () => {
    history.goBack();
  };

  const handleCancel = () => {
    history.push('/deposits');
  };

  const handleProgramSelect = (programId: string) => {
    const program = programsData.find(p => p.id === programId);
    history.push('/remote-capture-type', {
      selectedProgram: programId,
      programName: program?.name || ''
    });
  };

  // Filter programs based on search term
  const filteredPrograms = programsData.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="header-content">
            <div className="header-left">
              <IonButton fill="clear" className="header-button" onClick={handleBack}>
                <IonText>Back</IonText>
              </IonButton>
            </div>
            <div className="header-center">
              <IonTitle>Deposit to</IonTitle>
            </div>
            <div className="header-right">
              <IonButton fill="clear" className="header-button" onClick={handleCancel}>
                <IonText>Cancel</IonText>
              </IonButton>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          {/* Search Bar */}
          <div className="payments-search-header">
                  <div className="search-wrapper">
                    <div className="search-container">
                      <img src="/images/Search.svg" alt="Search" className="search-icon" />
                      <IonInput
                        placeholder="Search accounts"
                        className="search-input"
                      />
                    </div>
                    <IonButton fill="clear" className="filter-button">
                      <img src="/images/Filter.svg" alt="Filter" className="filter-icon" />
                    </IonButton>
                  </div>
                </div>


          {/* Programs List */}
          <div className="programs-list">
            {filteredPrograms.map((program) => (
              <IonCard 
                key={program.id} 
                className="program-card"
                onClick={() => handleProgramSelect(program.id)}
              >
                <IonCardContent className="program-card-content">
                  <div className="program-info">
                    <div className="program-name">{program.name}</div>
                    <div className="program-id">Program {program.id}</div>
                  </div>
                  <IonIcon name="chevron-forward" className="program-arrow" />
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DepositTo;
