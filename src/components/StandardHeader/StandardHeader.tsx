import React from 'react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import './StandardHeader.css';

interface StandardHeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

const StandardHeader: React.FC<StandardHeaderProps> = ({ left, center, right }) => {
  return (
    <IonHeader className="standard-header">
      <IonToolbar>
        <div className="header-layout">
          <div className="header-column header-left">{left}</div>
          <div className="header-column header-center">{center}</div>
          <div className="header-column header-right">{right}</div>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default StandardHeader;
