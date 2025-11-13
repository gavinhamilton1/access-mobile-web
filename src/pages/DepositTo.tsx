import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

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
      <IonHeader>
        <IonToolbar className="px-4">
          <div className="flex items-center justify-between py-2">
            <IonButton
              fill="clear"
              className="text-sm font-semibold text-slate-600"
              onClick={handleBack}
            >
              Back
            </IonButton>
            <IonTitle className="text-base font-semibold text-slate-800">Deposit to</IonTitle>
            <IonButton
              fill="clear"
              className="text-sm font-semibold text-slate-600"
              onClick={handleCancel}
            >
              Cancel
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="space-y-4 bg-slate-100 p-4 pb-12">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <img src="/images/Search.svg" alt="Search" className="h-5 w-5 opacity-60" />
            <IonInput
              placeholder="Search programs"
              value={searchTerm}
              onIonInput={e => setSearchTerm(e.detail.value ?? '')}
              className="text-sm text-slate-700"
            />
          </div>

          <div className="space-y-3">
            {filteredPrograms.map(program => (
              <IonCard
                key={program.id}
                button
                onClick={() => handleProgramSelect(program.id)}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-primary hover:shadow-md"
              >
                <IonCardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{program.name}</p>
                    <p className="text-xs text-slate-500">Program {program.id}</p>
                  </div>
                  <img src="/images/ArrowForward.svg" alt="Select" className="h-5 w-5" />
                </IonCardContent>
              </IonCard>
            ))}

            {filteredPrograms.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                No programs match that search.
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DepositTo;
