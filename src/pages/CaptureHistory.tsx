import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonInput,
  IonCard,
  IonCardContent,
  IonText,
  IonButton
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

interface CaptureHistoryItem {
  id: string;
  title: string;
  programNumber: string;
  amount: string;
  currency: string;
  status: 'action-required' | 'deposited';
  date: string;
}

const CaptureHistory: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');

  // Mock data based on the image
  const mockHistoryData: CaptureHistoryItem[] = [
    {
      id: '1',
      title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
      programNumber: 'Program 15501',
      amount: '3 000 000,00',
      currency: 'USD',
      status: 'action-required',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
      programNumber: 'Program 15501',
      amount: '100 000,00',
      currency: 'USD',
      status: 'action-required',
      date: '2024-01-15'
    },
    {
      id: '3',
      title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
      programNumber: 'Program 15501',
      amount: '25,00',
      currency: 'USD',
      status: 'action-required',
      date: '2024-01-15'
    },
    {
      id: '4',
      title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
      programNumber: 'Program 15501',
      amount: '50,00',
      currency: 'USD',
      status: 'deposited',
      date: '2024-01-14'
    },
    {
      id: '5',
      title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
      programNumber: 'Program 15501',
      amount: '75,00',
      currency: 'USD',
      status: 'deposited',
      date: '2024-01-14'
    },
    {
      id: '6',
      title: 'CAD PROGRAM CA/USD',
      programNumber: 'Program 931503602',
      amount: '80,12',
      currency: 'USD',
      status: 'action-required',
      date: '2024-01-13'
    },
    {
      id: '7',
      title: 'CAD PROGRAM CA/CAD',
      programNumber: 'Program 931503601',
      amount: '10,11',
      currency: 'CAD',
      status: 'action-required',
      date: '2024-01-13'
    },
    {
      id: '8',
      title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
      programNumber: 'Program 15501',
      amount: '125,00',
      currency: 'USD',
      status: 'deposited',
      date: '2024-01-12'
    }
  ];

  const handleBack = () => {
    history.goBack();
  };

  const handleItemClick = (item: CaptureHistoryItem) => {
    console.log('Navigate to item details:', item.id);
    // TODO: Navigate to item details page
  };

  const filteredData = mockHistoryData.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.programNumber.toLowerCase().includes(searchText.toLowerCase())
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
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          <div className="history-container">
            {/* Search Bar */}
              <IonCardContent className="card-content">
                <div className="search-container">
                  <img src="/images/Search.svg" alt="Search" className="search-icon" />
                  <IonInput
                    placeholder="Search transactions"
                    className="search-input"
                  />
                </div>
              </IonCardContent>

            {/* History List */}
            <div className="history-list">
              {filteredData.map((item) => (
                <IonCard 
                  key={item.id} 
                  className="card payment-card"
                  onClick={() => handleItemClick(item)}
                >
                  <IonCardContent className="card-content">
                    <div className="payment-item">
                      <div className="payment-details">
                        <div className="payment-left">
                          <IonText>
                            <h3 className="payment-id">{item.title}</h3>
                          </IonText>
                          <IonText color="medium">
                            <p className="payment-from">{item.programNumber}</p>
                          </IonText>
                        </div>
                        
                        <div className="payment-right">
                          <div className="payment-type-section">
                            <IonText>
                              <p className="payment-amount">{item.currency} {item.amount}</p>
                            </IonText>
                          </div>
                          
                          <div className="payment-status">
                            {item.status === 'action-required' ? (
                              <>
                                <img src="/images/Warning.svg" alt="Warning" className="warning-icon" />
                                <IonText color="warning">
                                  <p className="status-text-warning">Action Required</p>
                                </IonText>
                              </>
                            ) : (
                              <>
                                <img src="/images/Check.svg" alt="Check" className="warning-icon" />
                                <IonText color="success">
                                  <p className="status-text-success">Deposited</p>
                                </IonText>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CaptureHistory;
