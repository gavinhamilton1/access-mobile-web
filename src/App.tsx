import { Redirect, Route, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonRouter
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// Using custom SVG icons from public/images directory
import {
  Accounts as AccountsIcon,
  Deposits as DepositsIcon,
  Home as HomeIcon,
  Payments as PaymentsIcon,
  Profile as ProfileIcon,
} from './components/icons';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import AccountDetails from './pages/AccountDetails';
import AccountDetailsTransaction from './pages/AccountDetailsTransaction';
import Payments from './pages/Payments';
import TransactionDetails from './pages/TransactionDetails';
import ApproveRelease from './pages/ApproveRelease';
import Deposits from './pages/Deposits';
import RemoteCaptureType from './pages/RemoteCaptureType';
import ChooseGroup from './pages/ChooseGroup';
import DepositTo from './pages/DepositTo';
import CaptureBestPractices from './pages/CaptureBestPractices';
import ChooseSummary from './pages/ChooseSummary';
import CaptureCheck from './pages/CaptureCheck';
import CaptureSummary from './pages/CaptureSummary';
import CaptureHistory from './pages/CaptureHistory';
import DailySummary from './pages/DailySummary';
import DepositSuccess from './pages/DepositSuccess';
import Profile from './pages/Profile';
import AppExperience from './pages/AppExperience';
import PWAInstallPrompt from './components/PWAInstallPrompt';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* Tailwind + global styles */
import './index.css';

setupIonicReact();

interface TabBarLocationState {
  source?: 'payments' | 'accounts';
}

const TabBar: React.FC = () => {
  const router = useIonRouter();
  const location = useLocation();

  const handleTabClick = (path: string) => {
    // Use 'root' direction to reset navigation stack to the main tab page
    // This ensures we always go to the main page, not a detail page
    router.push(path, 'root', 'replace');
  };

  const isTabSelected = (path: string) => {
    const currentPath = location.pathname;
    const state = location.state as TabBarLocationState | undefined;
    
    // If we're on transaction-details page, use the source from state to determine which tab should be highlighted
    if (currentPath === '/transaction-details' && state?.source) {
      if (state.source === 'payments' && path === '/payments') {
        return true;
      }
      if (state.source === 'accounts' && path === '/accounts') {
        return true;
      }
      return false;
    }
    
    // If we're on any deposits-related page, highlight the deposits tab
    if (currentPath.startsWith('/deposits/') && path === '/deposits') {
      return true;
    }
    
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <IonTabBar slot="bottom">
      <IonTabButton 
        tab="home" 
        selected={isTabSelected('/home')}
        onClick={() => handleTabClick('/home')}
      >
        <HomeIcon size={30} className="tab-icon" />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton 
        tab="accounts" 
        selected={isTabSelected('/accounts')}
        onClick={() => handleTabClick('/accounts')}
      >
        <AccountsIcon size={30} className="tab-icon" />
        <IonLabel>Accounts</IonLabel>
      </IonTabButton>
      <IonTabButton 
        tab="payments" 
        selected={isTabSelected('/payments')}
        onClick={() => handleTabClick('/payments')}
      >
        <PaymentsIcon size={30} className="tab-icon" />
        <IonLabel>Payments</IonLabel>
      </IonTabButton>
      <IonTabButton 
        tab="deposits" 
        selected={isTabSelected('/deposits')}
        onClick={() => handleTabClick('/deposits')}
      >
        <DepositsIcon size={30} className="tab-icon" />
        <IonLabel>Deposits</IonLabel>
      </IonTabButton>
      <IonTabButton 
        tab="profile" 
        selected={isTabSelected('/profile')}
        onClick={() => handleTabClick('/profile')}
      >
        <ProfileIcon size={30} className="tab-icon" />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
        <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/accounts">
            <Accounts />
          </Route>
          <Route path="/accounts/account-details/:accountId">
            <AccountDetails />
          </Route>
          <Route path="/accounts/account-details/:accountId/transaction">
            <AccountDetailsTransaction />
          </Route>
          <Route exact path="/payments">
            <Payments />
          </Route>
          <Route exact path="/transaction-details">
            <TransactionDetails />
          </Route>
          <Route exact path="/approve-release">
            <ApproveRelease />
          </Route>
          <Route exact path="/deposits">
            <Deposits />
          </Route>
          <Route exact path="/deposits/deposit-to">
            <DepositTo />
          </Route>
          <Route exact path="/deposits/remote-capture-type">
            <RemoteCaptureType />
          </Route>
          <Route exact path="/deposits/choose-group">
            <ChooseGroup />
          </Route>
          <Route exact path="/deposits/choose-summary">
            <ChooseSummary />
          </Route>
          <Route exact path="/deposits/capture-best-practices">
            <CaptureBestPractices />
          </Route>
          <Route exact path="/deposits/capture-check">
            <CaptureCheck />
          </Route>
          <Route exact path="/deposits/capture-summary">
            <CaptureSummary />
          </Route>
          <Route exact path="/deposits/capture-history">
            <CaptureHistory />
          </Route>
          <Route exact path="/deposits/daily-summary">
            <DailySummary />
          </Route>
          <Route exact path="/deposits/deposit-success">
            <DepositSuccess />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/app-experience">
            <AppExperience />
          </Route>
        </IonRouterOutlet>
        <TabBar />
      </IonTabs>
      <PWAInstallPrompt />
    </IonReactRouter>
  </IonApp>
);

export default App;
