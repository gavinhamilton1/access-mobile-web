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
  IonCard,
  IonCardContent,
  IonModal,
  IonIcon,
} from '@ionic/react';
import { copyOutline, eyeOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  captureType?: string;
  selectedGroup?: string;
  selectedProgram?: string;
  programName?: string;
  frontImage?: string;
  backImage?: string;
  frontCheckDetails?: {
    routingNumber?: string;
    accountNumber?: string;
    checkNumber?: string;
    amount?: string;
    date?: string;
    payee?: string;
    memo?: string;
  };
  backCheckDetails?: {
    routingNumber?: string;
    accountNumber?: string;
    checkNumber?: string;
    amount?: string;
    date?: string;
    payee?: string;
    memo?: string;
  };
}

const CaptureSummary: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const captureType = state?.captureType || 'Check and document(s)';
  const selectedGroup = state?.selectedGroup || 'Maintenance Orders';
  const selectedProgram = state?.selectedProgram || '15501';
  const programName = state?.programName || 'AUTOAL1 RDC PROGRAM 1 GROUPS';
  const frontImage = state?.frontImage;
  const backImage = state?.backImage;
  const frontCheckDetails = state?.frontCheckDetails;

  const [amount, setAmount] = useState('3 000 000,00');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [controlNumber, setControlNumber] = useState('');
  const [isAmountConfirmed, setIsAmountConfirmed] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const isCheckCapture = captureType.includes('Check');

  useEffect(() => {
    if (frontCheckDetails) {
      if (frontCheckDetails.routingNumber) {
        setRoutingNumber(frontCheckDetails.routingNumber);
      }
      if (frontCheckDetails.accountNumber) {
        setAccountNumber(frontCheckDetails.accountNumber);
      }
      if (frontCheckDetails.amount) {
        setAmount(frontCheckDetails.amount);
      }
    }
  }, [frontCheckDetails]);

  const handleBack = () => history.goBack();
  const handleCancel = () => history.push('/deposits');
  const handleAmountConfirmation = (confirmed: boolean) => setIsAmountConfirmed(confirmed);

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(fieldName);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleImagePreview = (imageSrc: string) => {
    setPreviewImage(imageSrc);
    setIsPreviewModalOpen(true);
  };

  const handleSubmit = () => {
    history.push('/deposit-success', {
      captureType,
      selectedGroup,
      selectedProgram,
      programName,
      amount,
    });
  };

  const summaryCards = [
    {
      title: selectedProgram,
      details: ['AUTOAL1 RDC', 'PROGRAM 1', 'GROUPS'],
    },
    {
      title: 'Group',
      details: ['Maintenance', 'Orders'],
    },
  ];

  const confirmationButtons = [
    { label: 'No', action: () => handleAmountConfirmation(false), style: 'border border-slate-200 text-slate-600' },
    { label: 'Yes', action: () => handleAmountConfirmation(true), style: 'bg-teal-primary text-white shadow-sm' },
  ];

  const inputFields = [
    {
      label: 'Payment/serial number',
      value: paymentNumber,
      placeholder: 'Enter payment/serial number',
      setValue: setPaymentNumber,
    },
    {
      label: 'Routing number',
      value: routingNumber,
      placeholder: 'Enter routing number',
      setValue: setRoutingNumber,
      copyValue: frontCheckDetails?.routingNumber,
      copyField: 'routing',
    },
    {
      label: 'Account number',
      value: accountNumber,
      placeholder: 'Enter account number',
      setValue: setAccountNumber,
      copyValue: frontCheckDetails?.accountNumber,
      copyField: 'account',
    },
    {
      label: 'Control number',
      value: controlNumber,
      placeholder: 'Enter control number',
      setValue: setControlNumber,
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="px-4">
          <div className="flex items-center justify-between gap-3 py-2">
            <IonButton
              fill="clear"
              className="text-sm font-semibold text-slate-600"
              onClick={handleBack}
            >
              Back
            </IonButton>
            <IonTitle className="text-base font-semibold text-slate-800">Deposit check</IonTitle>
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
        <div className="space-y-6 bg-slate-100 p-4 pb-32">
          <div className="grid gap-4 sm:grid-cols-2">
            {summaryCards.map(card => (
              <IonCard key={card.title} className="rounded-2xl border border-slate-200 shadow-sm">
                <IonCardContent className="space-y-2 p-4 text-center">
                  <p className="text-base font-semibold text-slate-900">{card.title}</p>
                  <div className="text-sm text-slate-500">
                    {card.details.map(line => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>

          <div className="text-center">
            <IonText>
              <h1 className="text-3xl font-semibold text-slate-900">USD {amount}</h1>
            </IonText>
            {!isAmountConfirmed && (
              <p className="mt-2 text-xs font-medium text-amber-500">Confirm the amount before submitting.</p>
            )}
          </div>

          {isCheckCapture && (
            <div className="grid gap-4 sm:grid-cols-2">
              {[{ label: 'Front', image: frontImage }, { label: 'Back', image: backImage }]
                .filter(item => Boolean(item.image))
                .map(item => (
                  <div key={item.label} className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-700">{item.label}</h3>
                    <button
                      type="button"
                      onClick={() => handleImagePreview(item.image as string)}
                      className="group relative h-32 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <img
                        src={item.image as string}
                        alt={`${item.label} of check`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                        <IonIcon icon={eyeOutline} className="h-6 w-6 text-white" />
                      </div>
                    </button>
                  </div>
                ))}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-700">
              Are you sure USD {amount} is the correct amount?
            </p>
            <div className="mt-4 flex gap-3">
              {confirmationButtons.map(button => (
                <button
                  key={button.label}
                  type="button"
                  onClick={button.action}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${button.style}`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {inputFields.map(field => (
              <div key={field.label} className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {field.label}
                </label>
                <div className="flex gap-2">
                  <IonInput
                    value={field.value}
                    onIonInput={e => field.setValue(e.detail.value ?? '')}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                  />
                  {field.copyValue && (
                    <button
                      type="button"
                      onClick={() => handleCopyToClipboard(field.copyValue!, field.copyField as string)}
                      className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-teal-primary hover:text-teal-primary"
                    >
                      <span className="flex items-center gap-1">
                        <IonIcon icon={copyOutline} />
                        {copySuccess === field.copyField ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <IonButton
            expand="block"
            className="rounded-full bg-teal-primary py-3 text-sm font-semibold text-white shadow-lg"
            onClick={handleSubmit}
            disabled={!isAmountConfirmed}
          >
            Submit
          </IonButton>
        </div>

        <IonModal isOpen={isPreviewModalOpen} onDidDismiss={() => setIsPreviewModalOpen(false)}>
          <IonHeader>
            <IonToolbar className="px-4">
              <div className="flex items-center justify-between py-2">
                <IonTitle className="text-base font-semibold text-slate-800">Image Preview</IonTitle>
                <IonButton
                  fill="clear"
                  className="text-sm font-semibold text-slate-600"
                  onClick={() => setIsPreviewModalOpen(false)}
                >
                  Close
                </IonButton>
              </div>
            </IonToolbar>
          </IonHeader>
          <IonContent className="flex items-center justify-center bg-black">
            {previewImage && (
              <img src={previewImage} alt="Preview" className="max-h-full max-w-full object-contain" />
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CaptureSummary;
