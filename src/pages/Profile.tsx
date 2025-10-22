import React from 'react';
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
  IonIcon,
  IonItem,
  IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Profile: React.FC = () => {
  const history = useHistory();

  const handleSettings = () => {
    console.log('Navigate to Settings');
  };

  const handleSupport = () => {
    console.log('Navigate to Support');
  };

  const handleNotifications = () => {
    console.log('Navigate to Notifications');
  };

  const handleGiveFeedback = () => {
    console.log('Give feedback');
  };

  const handleLogout = () => {
    console.log('Log out');
  };

  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="header-content">
            <div className="header-left">
            </div>
            <div className="header-center">
              <IonTitle>Profile</IonTitle>
            </div>
            <div className="header-right">
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          <div className="profile-container">
            {/* User Information */}
            <div className="user-info-section">
              <IonCard className="user-info-card">
                <IonCardContent className="user-info-content">
                  <div className="user-info">
                    <IonIcon icon="/images/Profile.svg" className="user-avatar" />
                    <IonText>
                      <h2 className="user-name">test mobile</h2>
                    </IonText>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>

            {/* Navigation Items */}
            <div className="profile-options">
              <IonCard className="profile-option-card" onClick={handleSettings}>
                <IonCardContent className="profile-option-content">
                  <IonItem className="profile-option-item">
                    <IonIcon icon="/images/Settings.svg" slot="start" className="option-icon" />
                    <IonLabel>Settings</IonLabel>
                    <IonIcon icon="/images/ArrowForward.svg" slot="end" className="option-arrow" />
                  </IonItem>
                </IonCardContent>
              </IonCard>

              <IonCard className="profile-option-card" onClick={handleSupport}>
                <IonCardContent className="profile-option-content">
                  <IonItem className="profile-option-item">
                    <IonIcon icon="/images/Alert.svg" slot="start" className="option-icon" />
                    <IonLabel>Support</IonLabel>
                    <IonIcon icon="/images/ArrowForward.svg" slot="end" className="option-arrow" />
                  </IonItem>
                </IonCardContent>
              </IonCard>

              <IonCard className="profile-option-card" onClick={handleNotifications}>
                <IonCardContent className="profile-option-content">
                  <IonItem className="profile-option-item">
                    <IonIcon icon="/images/Alert.svg" slot="start" className="option-icon" />
                    <IonLabel>Notifications</IonLabel>
                    <IonIcon icon="/images/ArrowForward.svg" slot="end" className="option-arrow" />
                  </IonItem>
                </IonCardContent>
              </IonCard>
            </div>

            {/* Last Login */}
            <div className="last-login-section">
              <IonText>
                <p className="last-login-label">Last login</p>
              </IonText>
              <IonText color="medium">
                <p className="last-login-time">20-Oct-25 at 4:43 PM</p>
              </IonText>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              <IonButton 
                fill="outline" 
                className="feedback-button"
                onClick={handleGiveFeedback}
              >
                <IonText>Give feedback</IonText>
              </IonButton>

              <IonButton 
                fill="solid" 
                className="logout-button"
                onClick={handleLogout}
              >
                <IonText>Log out</IonText>
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
