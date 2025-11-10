import React from 'react';
import { IonCard, IonCardContent } from '@ionic/react';
import './AccountCard.css';

interface AccountCardProps {
  account: {
    id: string;
    name: string;
    number: string;
    currency: string;
    currentBalance: string;
    isStarred: boolean;
  };
  onClick: (accountId: string) => void;
  onStarClick: (accountId: string, event: React.MouseEvent) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onClick, onStarClick }) => {
  return (
    <IonCard className="card" onClick={() => onClick(account.id)}>
      <IonCardContent className="card-content">
        <div className="account-item">
          <img
            src={account.isStarred ? "/images/StarFilled.svg" : "/images/StarBlank.svg"}
            alt="Star"
            className="icon-small account-star"
            onClick={(e) => onStarClick(account.id, e)}
            style={{ cursor: 'pointer' }}
          />
          <div className="account-details">
            <h3>{account.name}<span className="account-number">{account.number}</span></h3>
            <p className="account-balance">{account.currency} {account.currentBalance}</p>
          </div>
          <img src="/images/ArrowForward.svg" alt="Chevron" className="icon-small" />
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default AccountCard;
