import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonInput,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

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
            <IonTitle className="text-base font-semibold text-slate-800">Choose a group</IonTitle>
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
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">Program</p>
            <p className="text-sm font-semibold text-slate-900">{programName || 'Program selection'}</p>
            <p className="text-xs text-slate-500">{selectedProgram || 'Choose a program to continue'}</p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <img src="/images/Search.svg" alt="Search" className="h-5 w-5 opacity-60" />
            <IonInput
              placeholder="Search groups"
              value={searchTerm}
              onIonInput={e => setSearchTerm(e.detail.value ?? '')}
              className="text-sm text-slate-700"
            />
          </div>

          <div className="space-y-3">
            {filteredGroups.map(group => (
              <button
                key={group}
                type="button"
                onClick={() => handleGroupSelect(group)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-sm font-semibold text-slate-900 shadow-sm transition hover:border-teal-primary hover:shadow-md"
              >
                <span>{group}</span>
                <img src="/images/ArrowForward.svg" alt="Select" className="h-5 w-5" />
              </button>
            ))}

            {filteredGroups.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                No groups match that search.
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChooseGroup;
