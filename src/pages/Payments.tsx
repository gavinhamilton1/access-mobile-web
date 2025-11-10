import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const mockPayments = {
  approve: [
    { id: 'Analytics03102025.230927', from: 'From (..8488)', type: 'Book transfer', amount: 'USD 101,00', status: 'Expired value date', cutOffDate: '10/04/25' },
    { id: 'Analytics05102025.194102', from: 'From (..8488)', type: 'Book transfer', amount: 'USD 101,00', status: 'Expired value date', cutOffDate: '10/05/25' },
    { id: 'Analytics06102025.193816', from: 'From (..8488)', type: 'Wire', amount: 'USD 10,00', status: 'Expired value date', cutOffDate: '10/06/25' },
    { id: 'Analytics07102025.193545', from: 'From (..8488)', type: 'Wire', amount: 'USD 10,00', status: 'Expired value date', cutOffDate: '10/07/25' },
  ],
  release: [
    { id: 'Analytics01102025.194659', from: 'From (..8488)', type: 'Wire', amount: 'USD 1,12', status: 'Expired value date', cutOffDate: '10/01/25' },
    { id: 'Analytics01102025.193752', from: 'From (..8488)', type: 'Wire', amount: 'USD 1,12', status: 'Expired value date', cutOffDate: '10/01/25' },
    { id: 'CSWIREAPI', from: 'From (..8488)', type: 'Wire', amount: 'USD 1,12', status: 'Expired value date', cutOffDate: '10/01/25' },
    { id: 'CSAutoACH Credit4792', from: 'From (..8280)', type: 'ACH Credit', amount: 'USD 20,01', status: 'Expired value date', cutOffDate: '10/02/25' },
    { id: 'CSITCAPI', from: 'From (..8280)', type: 'ACH Credit', amount: 'USD 100,01', status: 'Expired value date', cutOffDate: '10/02/25' },
  ],
};

const Payments: React.FC = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<'approve' | 'release'>('approve');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const getPaymentsByCutOffDate = (payments: any[]) => {
    return payments.reduce((acc, payment) => {
      const date = payment.cutOffDate;
      if (!acc[date]) acc[date] = [];
      acc[date].push(payment);
      return acc;
    }, {});
  };

  const currentPayments = activeTab === 'approve' ? mockPayments.approve : mockPayments.release;
  const groupedPayments = getPaymentsByCutOffDate(currentPayments);

  const handleSelectToggle = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) setSelectedItems(new Set());
  };

  const handleItemSelect = (paymentId: string) => {
    const newSelected = new Set(selectedItems);
    newSelected.has(paymentId) ? newSelected.delete(paymentId) : newSelected.add(paymentId);
    setSelectedItems(newSelected);
  };

  const handleActionClick = (actionType: 'approve' | 'release') => {
    const selectedPaymentItems = currentPayments.filter(p => selectedItems.has(p.id));
    history.push('/approve-release', { selectedItems: selectedPaymentItems, actionType });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center p-4">
          <button onClick={handleSelectToggle} className="text-blue-600">{isSelectMode ? 'Cancel' : 'Select'}</button>
          <h1 className="text-xl font-semibold">Pending payments</h1>
          <button className="text-blue-600">History</button>
        </div>
        <div className="p-4">
          <div className="flex items-center bg-gray-200 rounded-lg p-2">
            <img src="/images/Search.svg" alt="Search" className="w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder={activeTab === 'approve' ? "Search approvals" : "Search releases"}
              className="bg-transparent focus:outline-none w-full"
            />
            <button className="ml-2">
              <img src="/images/Filter.svg" alt="Filter" className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="border-b">
          <div className="flex">
            <button
              className={`flex-1 py-2 text-center ${activeTab === 'approve' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('approve')}
            >
              Approve
            </button>
            <button
              className={`flex-1 py-2 text-center ${activeTab === 'release' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('release')}
            >
              Release
            </button>
          </div>
        </div>
      </header>
      <main className="p-4">
        {Object.entries(groupedPayments).map(([date, payments]) => (
          <div key={date}>
            <div className="bg-gray-200 px-4 py-1">
              <p className="text-sm text-gray-600">Cut-off date {date}</p>
            </div>
            {(payments as any[]).map(payment => (
              <div
                key={payment.id}
                className={`bg-white p-4 border-b ${isSelectMode ? 'cursor-pointer' : ''}`}
                onClick={() => isSelectMode && handleItemSelect(payment.id)}
              >
                <div className="flex items-center">
                  {isSelectMode && (
                    <input
                      type="checkbox"
                      checked={selectedItems.has(payment.id)}
                      onChange={() => handleItemSelect(payment.id)}
                      className="mr-4"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{payment.id}</h3>
                        <p className="text-sm text-gray-500">{payment.from}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 flex items-center">{payment.type} <img src="/images/ArrowForward.svg" alt=">" className="w-4 h-4 ml-1" /></p>
                        <p className="font-semibold">{payment.amount}</p>
                        <div className="flex items-center text-yellow-500 text-sm">
                          <img src="/images/Warning.svg" alt="!" className="w-4 h-4 mr-1" />
                          {payment.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>
      {selectedItems.size > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-around">
          <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full w-1/2 mr-2">
            Reject ({selectedItems.size})
          </button>
          <button
            onClick={() => handleActionClick(activeTab)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full w-1/2 ml-2"
          >
            {activeTab === 'approve' ? 'Approve' : 'Release'} ({selectedItems.size})
          </button>
        </footer>
      )}
    </div>
  );
};

export default Payments;
