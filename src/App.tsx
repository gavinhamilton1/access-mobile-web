import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// Using custom SVG icons from public/images directory
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import AccountDetails from './pages/AccountDetails';
import Payments from './pages/Payments';
import ApproveRelease from './pages/ApproveRelease';
import Deposits from './pages/Deposits';
import RemoteCaptureType from './pages/RemoteCaptureType';
import ChooseGroup from './pages/ChooseGroup';
import DepositTo from './pages/DepositTo';
import CaptureBestPractices from './pages/CaptureBestPractices';
import ChooseSummary from './pages/ChooseSummary';
import CaptureCheck from './pages/CaptureCheck';
import CaptureSummary from './pages/CaptureSummary';
import Tab3 from './pages/Tab3';

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

/* Global styles */
import './styles.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/accounts">
            <Accounts />
          </Route>
          <Route path="/accounts/account-details/:accountId">
            <AccountDetails />
          </Route>
          <Route exact path="/payments">
            <Payments />
          </Route>
          <Route exact path="/approve-release">
            <ApproveRelease />
          </Route>
          <Route exact path="/deposits">
            <Deposits />
          </Route>
          <Route exact path="/deposit-to">
            <DepositTo />
          </Route>
          <Route exact path="/remote-capture-type">
            <RemoteCaptureType />
          </Route>
          <Route exact path="/choose-group">
            <ChooseGroup />
          </Route>
          <Route exact path="/capture-best-practices">
            <CaptureBestPractices />
          </Route>
          <Route exact path="/choose-summary">
            <ChooseSummary />
          </Route>
          <Route exact path="/capture-check">
            <CaptureCheck />
          </Route>
          <Route exact path="/capture-summary">
            <CaptureSummary />
          </Route>
          <Route exact path="/profile">
            <Tab3 />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <img src="/images/Home.svg" alt="Home" className="tab-icon" />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="accounts" href="/accounts">
            <img src="/images/Accounts.svg" alt="Accounts" className="tab-icon" />
            <IonLabel>Accounts</IonLabel>
          </IonTabButton>
          <IonTabButton tab="payments" href="/payments">
            <img src="/images/Payments.svg" alt="Payments" className="tab-icon" />
            <IonLabel>Payments</IonLabel>
          </IonTabButton>
          <IonTabButton tab="deposits" href="/deposits">
            <img src="/images/Deposits.svg" alt="Deposits" className="tab-icon" />
            <IonLabel>Deposits</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <img src="/images/Profile.svg" alt="Profile" className="tab-icon" />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
