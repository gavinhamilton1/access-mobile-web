import React from 'react';
import { IonCard, IonCardContent, IonText } from '@ionic/react';
import './PaymentCard.css';

interface PaymentCardProps {
  payment: {
    id: string;
    from: string;
    type: string;
    amount: string;
    status: string;
  };
  isSelectMode: boolean;
  isSelected: boolean;
  onSelect: (paymentId: string) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment, isSelectMode, isSelected, onSelect }) => {
  return (
    <IonCard
      className={`card payment-card ${isSelectMode ? 'selectable-card' : ''}`}
      onClick={isSelectMode ? () => onSelect(payment.id) : undefined}
    >
      <IonCardContent className="card-content">
        <div className="payment-item">
          {isSelectMode && (
            <div className="payment-select">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(payment.id)}
                className="payment-radio"
              />
            </div>
          )}
          <div className="payment-details">
            <div className="payment-left">
              <IonText>
                <h3 className="payment-id">{payment.id}</h3>
              </IonText>
              <IonText color="medium">
                <p className="payment-from">{payment.from}</p>
              </IonText>
            </div>
            <div className="payment-right">
              <div className="payment-type-section">
                <IonText color="medium">
                  <p className="payment-type">{payment.type} <img src="/images/ArrowForward.svg" alt="Arrow" className="icon-small" /></p>
                </IonText>
                <IonText>
                  <p className="payment-amount">{payment.amount}</p>
                </IonText>
              </div>
              <div className="payment-status">
                <img src="/images/Warning.svg" alt="Warning" className="warning-icon" />
                <IonText color="warning">
                  <p className="status-text-warning">{payment.status}</p>
                </IonText>
              </div>
            </div>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default PaymentCard;
