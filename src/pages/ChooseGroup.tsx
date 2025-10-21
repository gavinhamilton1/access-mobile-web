import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  captureType?: string;
  selectedProgram?: string;
  programName?: string;
}

const ChooseGroup: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [captureType, setCaptureType] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [programName, setProgramName] = useState<string>('');

  // Mock group data - only first three groups
  const mockGroups = [
    'Tax Sales',
    'Maintenance Orders', 
    'Store Receipts'
  ];

  // Get data from navigation state
  React.useEffect(() => {
    const state = location.state as LocationState;
    if (state?.captureType) {
      setCaptureType(state.captureType);
    }
    if (state?.selectedProgram) {
      setSelectedProgram(state.selectedProgram);
    }
    if (state?.programName) {
      setProgramName(state.programName);
    }
  }, [location.state]);

  const handleBack = () => {
    history.goBack();
  };

  const handleCancel = () => {
    history.push('/deposits');
  };

  const handleGroupSelect = (groupName: string) => {
    console.log(`Selected group: ${groupName} for capture type: ${captureType}`);
    // Navigate to choose summary with all data
    history.push('/choose-summary', {
      captureType: captureType,
      selectedGroup: groupName,
      selectedProgram: selectedProgram,
      programName: programName
    });
  };

  // Filter groups based on search term
  const filteredGroups = mockGroups.filter(group =>
    group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="choose-group-header">
            <div className="header-left">
              <IonButton fill="clear" className="header-button" onClick={handleBack}>
                <IonText>Back</IonText>
              </IonButton>
            </div>
            <div className="header-center">
              <IonTitle>Choose a group</IonTitle>
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
    

          {/* Groups List */}
          <div className="groups-container">
            {filteredGroups.map((group, index) => (
              <div 
                key={index} 
                className="group-option" 
                onClick={() => handleGroupSelect(group)}
              >
                <div className="group-content">
                  <IonText>
                    <h3 className="group-name">{group}</h3>
                  </IonText>
                  <IonIcon 
                    icon="/images/ArrowForward.svg" 
                    className="group-arrow"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChooseGroup;
