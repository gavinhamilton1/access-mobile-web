import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

interface DailySummaryItem {
  id: string;
  date: string;
  depositsCount: number;
  totalValue: string;
}

const DailySummary: React.FC = () => {
  const history = useHistory();

  // Mock data based on the image
  const mockDailyData: DailySummaryItem[] = [
    {
      id: '1',
      date: '10/15/25',
      depositsCount: 0,
      totalValue: '$0,00'
    },
    {
      id: '2',
      date: '10/14/25',
      depositsCount: 0,
      totalValue: '$0,00'
    },
    {
      id: '3',
      date: '10/13/25',
      depositsCount: 1,
      totalValue: '$10,11'
    },
    {
      id: '4',
      date: '10/12/25',
      depositsCount: 0,
      totalValue: '$0,00'
    },
    {
      id: '5',
      date: '10/11/25',
      depositsCount: 2,
      totalValue: '$388,12'
    },
    {
      id: '6',
      date: '10/10/25',
      depositsCount: 1,
      totalValue: '$2,00'
    },
    {
      id: '7',
      date: '10/09/25',
      depositsCount: 0,
      totalValue: '$0,00'
    },
    {
      id: '8',
      date: '10/08/25',
      depositsCount: 0,
      totalValue: '$0,00'
    },
    {
      id: '9',
      date: '10/07/25',
      depositsCount: 0,
      totalValue: '$0,00'
    }
  ];

  const handleBack = () => {
    history.goBack();
  };

  const handleDayClick = (item: DailySummaryItem) => {
    console.log('Navigate to day details:', item.date);
    // TODO: Navigate to day details page
  };

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
              <IonTitle>Daily summary</IonTitle>
            </div>
            <div className="header-right">
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          <div className="daily-summary-container">
            {/* Daily Summary List */}
            <div className="daily-summary-list">
              {mockDailyData.map((item) => (
                <IonCard 
                  key={item.id} 
                  className="card daily-summary-card"
                  onClick={() => handleDayClick(item)}
                >
                  <IonCardContent className="card-content">
                    <div className="daily-summary-item">
                      <div className="daily-summary-left">
                        <IonText>
                          <p className="deposits-label">Deposits</p>
                        </IonText>
                        <IonText>
                          <p className="deposits-count">{item.depositsCount}</p>
                        </IonText>
                      </div>
                      
                      <div className="daily-summary-center">
                        <IonText>
                          <p className="total-value-label">Total Value</p>
                        </IonText>
                        <IonText>
                          <p className="total-value-amount">{item.totalValue}</p>
                        </IonText>
                      </div>
                      
                      <div className="daily-summary-right">
                        <IonText>
                          <p className="summary-date">{item.date}</p>
                        </IonText>
                        <IonIcon 
                          icon="/images/ArrowForward.svg" 
                          className="summary-arrow"
                        />
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

export default DailySummary;
