import React from 'react';
import { IonCard, IonCardContent, IonText, IonSelect, IonSelectOption } from '@ionic/react';
import './BalanceCard.css';

const BalanceCard: React.FC = () => {
  return (
    <IonCard className="card balance-card">
      <IonCardContent className="card-content">
        <div className="balance-row">
          <div className="balance-label-section">
            <IonText color="medium">
              <p className="text-small">Current available</p>
            </IonText>
            <IonText>
              <h2 className="text-large">1 063 261<span className="decimal-part">,52</span></h2>
            </IonText>
          </div>
          <div className="balance-amount-section">
            <IonSelect
              value="USD"
              interface="popover"
              className="currency-select-inline"
            >
              <IonSelectOption value="USD">USD</IonSelectOption>
              <IonSelectOption value="EUR">EUR</IonSelectOption>
              <IonSelectOption value="GBP">GBP</IonSelectOption>
            </IonSelect>
          </div>
        </div>

        <div className="balance-divider"></div>

        <div className="balance-row">
          <div className="balance-label-section">
            <span>Opening balance</span>
          </div>
          <div className="balance-amount-section">
            <span className="text-bold">1 063 261,52</span>
          </div>
        </div>

        <div className="balance-divider"></div>

        <div className="balance-row">
          <div className="balance-label-section">
            <span>Current balance</span>
          </div>
          <div className="balance-amount-section">
            <span className="text-bold">1 063 261,52</span>
          </div>
        </div>

        <div className="balance-divider"></div>

        <div className="balance-row">
          <div className="balance-label-section">
            <div className="credit-debit-left">
              <img src="/images/PiggyBank.svg" alt="Credits" className="icon-small" />
              <span>Credits</span>
            </div>
          </div>
          <div className="balance-amount-section">
            <span className="text-bold">0,00</span>
          </div>
        </div>

        <div className="balance-divider"></div>

        <div className="balance-row">
          <div className="balance-label-section">
            <div className="credit-debit-left">
              <img src="/images/VisibilityOn.svg" alt="Debits" className="icon-small" />
              <span>Debits</span>
            </div>
          </div>
          <div className="balance-amount-section">
            <span className="text-bold">(0,00)</span>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default BalanceCard;
