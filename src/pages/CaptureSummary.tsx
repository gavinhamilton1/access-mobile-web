import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonModal } from '@ionic/react';
import { Button, Card, FlexLayout, Input, StackLayout, Text } from '@salt-ds/core';
import { useHistory, useLocation } from 'react-router-dom';
import { Check, Close, Retake } from '../components/icons';
import './home.css';

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
                Deposit check
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
          <StackLayout className="salt-page-content" gap={2}>
            <FlexLayout gap={1} style={{ flexWrap: 'wrap' }}>
              {summaryCards.map(card => (
                <Card key={card.title} className="salt-card" style={{ flex: 1, minWidth: '200px' }}>
                  <StackLayout gap={0.5} align="center" className="salt-card-section" style={{ padding: 'var(--salt-spacing-150)', textAlign: 'center' }}>
                    <Text styleAs="h4">{card.title}</Text>
                    <StackLayout gap={0.2}>
                      {card.details.map(line => (
                        <Text key={line} styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                          {line}
                        </Text>
                      ))}
                    </StackLayout>
                  </StackLayout>
                </Card>
              ))}
            </FlexLayout>

            <StackLayout gap={0.5} style={{ textAlign: 'center' }}>
              <Text styleAs="h1">USD {amount}</Text>
              {!isAmountConfirmed && (
                <Text styleAs="label" style={{ color: 'var(--salt-status-warning-foreground)', fontSize: '0.75rem' }}>
                  Confirm the amount before submitting.
                </Text>
              )}
            </StackLayout>

            {isCheckCapture && (
              <FlexLayout gap={1} style={{ flexWrap: 'wrap' }}>
                {[{ label: 'Front', image: frontImage }, { label: 'Back', image: backImage }]
                  .filter(item => Boolean(item.image))
                  .map(item => (
                    <StackLayout key={item.label} gap={0.5} style={{ flex: 1, minWidth: '200px' }}>
                      <Text styleAs="h4" style={{ fontSize: '0.875rem' }}>{item.label}</Text>
                      <button
                        type="button"
                        onClick={() => handleImagePreview(item.image as string)}
                        style={{
                          height: '128px',
                          width: '100%',
                          borderRadius: '12px',
                          border: '1px solid var(--salt-separable-secondary-borderColor)',
                          background: 'var(--salt-container-primary-background)',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          padding: 0,
                        }}
                      >
                        <img
                          src={item.image as string}
                          alt={`${item.label} of check`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </button>
                    </StackLayout>
                  ))}
              </FlexLayout>
            )}

            <Card className="salt-card">
              <StackLayout gap={1} className="salt-card-section" style={{ padding: 'var(--salt-spacing-200)' }}>
                <Text styleAs="label">Are you sure USD {amount} is the correct amount?</Text>
                <FlexLayout gap={1}>
                  <Button
                    appearance="bordered"
                    sentiment="neutral"
                    onClick={() => handleAmountConfirmation(false)}
                    style={{ flex: 1, borderRadius: '999px' }}
                  >
                    <Text styleAs="label">No</Text>
                  </Button>
                  <Button
                    appearance="solid"
                    sentiment="accented"
                    onClick={() => handleAmountConfirmation(true)}
                    style={{ flex: 1, borderRadius: '999px' }}
                  >
                    <Text styleAs="label">Yes</Text>
                  </Button>
                </FlexLayout>
              </StackLayout>
            </Card>

            <StackLayout gap={1}>
              {inputFields.map(field => (
                <StackLayout key={field.label} gap={0.5}>
                  <Text styleAs="label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--salt-content-secondary-foreground)' }}>
                    {field.label}
                  </Text>
                  <FlexLayout gap={1}>
                    <Input
                      value={field.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.setValue(e.target.value)}
                      placeholder={field.placeholder}
                      style={{ flex: 1, fontSize: '0.875rem' }}
                    />
                    {field.copyValue && (
                      <Button
                        appearance="bordered"
                        sentiment="neutral"
                        onClick={() => handleCopyToClipboard(field.copyValue!, field.copyField as string)}
                        style={{ borderRadius: '999px', whiteSpace: 'nowrap' }}
                      >
                        <Text styleAs="label">
                          {copySuccess === field.copyField ? 'Copied!' : 'Copy'}
                        </Text>
                      </Button>
                    )}
                  </FlexLayout>
                </StackLayout>
              ))}
            </StackLayout>

            <Button
              appearance="solid"
              sentiment="accented"
              onClick={handleSubmit}
              disabled={!isAmountConfirmed}
              style={{ borderRadius: '999px', width: '100%' }}
            >
              <Text styleAs="label">Submit</Text>
            </Button>
          </StackLayout>
        </div>

        <IonModal isOpen={isPreviewModalOpen} onDidDismiss={() => setIsPreviewModalOpen(false)}>
          <IonHeader translucent={false}>
            <IonToolbar className="salt-toolbar">
              <div className="salt-toolbar-content">
                <div className="salt-header-left" />
                <div className="salt-header-center">
                  <Text styleAs="h4" className="salt-toolbar-title">
                    Image Preview
                  </Text>
                </div>
                <div className="salt-header-right">
                  <Button
                    appearance="transparent"
                    sentiment="neutral"
                    onClick={() => setIsPreviewModalOpen(false)}
                    style={{ padding: `0 var(--salt-spacing-100)` }}
                  >
                    <Close size={20} className="salt-inline-icon" />
                  </Button>
                </div>
              </div>
            </IonToolbar>
          </IonHeader>
          <IonContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
            {previewImage && (
              <img src={previewImage} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CaptureSummary;
