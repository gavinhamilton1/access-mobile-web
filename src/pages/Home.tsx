import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  const handleCaptureDeposit = () => {
    history.push('/deposit-to');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="flex justify-between items-center p-4">
          <div className="text-center flex-1">
            <p className="text-gray-600">Welcome, test.</p>
          </div>
          <img src="/images/Alert.svg" alt="Alerts" className="w-6 h-6" />
        </div>
      </header>
      <main className="p-4">
        {/* Balance Overview Card */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Current day</p>
              <h2 className="text-2xl font-bold">1 063 261<span className="text-lg">,52</span></h2>
            </div>
            <select className="border-none bg-transparent text-blue-600">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Prior day</p>
              <h2 className="text-2xl font-bold">1 063 261<span className="text-lg">,52</span></h2>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img src="/images/PiggyBank.svg" alt="Credits" className="w-5 h-5 mr-2" />
              <span>Credits</span>
            </div>
            <span className="font-bold">0,00</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/images/VisibilityOn.svg" alt="Debits" className="w-5 h-5 mr-2" />
              <span>Debits</span>
            </div>
            <span className="font-bold">(0,00)</span>
          </div>
        </div>

        {/* Payment Actions Card */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center">
              <img src="/images/Check.svg" alt="Approve" className="w-5 h-5 mr-2" />
              <span>Approve payment</span>
            </div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <img src="/images/ListCheck.svg" alt="Release" className="w-5 h-5 mr-2" />
              <span>Release payment</span>
            </div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* File Transmissions Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">File Transmissions</h3>
          <div>
            <div className="flex justify-between items-center py-2 border-b">
              <div className="flex items-center">
                <img src="/images/CircleCheck.svg" alt="Sent" className="w-5 h-5 mr-2" />
                <span>Sent for processing</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">55</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <div className="flex items-center">
                <img src="/images/CircleInfo.svg" alt="In process" className="w-5 h-5 mr-2" />
                <span>In process</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">648</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center">
                <img src="/images/CircleCross.svg" alt="Failed" className="w-5 h-5 mr-2" />
                <span>Failed</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">7</span>
            </div>
          </div>
        </div>
        <div className="h-20"></div>
      </main>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-sm">
        <button
          className="bg-blue-600 text-white w-full py-3 rounded-full shadow-lg flex items-center justify-center"
          onClick={handleCaptureDeposit}
        >
          <img src="/images/Camera.svg" alt="Camera" className="w-6 h-6 mr-2" />
          Capture deposit
        </button>
      </div>
    </div>
  );
};

export default Home;
