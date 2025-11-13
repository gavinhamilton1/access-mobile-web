import React, { useMemo, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const mockPayments = {
  approve: [
    {
      id: 'Analytics03102025.230927',
      from: 'From (..8488)',
      type: 'Book transfer',
      amount: 'USD 101,00',
      status: 'Expired value date',
      cutOffDate: '10/04/25',
    },
    {
      id: 'Analytics05102025.194102',
      from: 'From (..8488)',
      type: 'Book transfer',
      amount: 'USD 101,00',
      status: 'Expired value date',
      cutOffDate: '10/05/25',
    },
    {
      id: 'Analytics06102025.193816',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 10,00',
      status: 'Expired value date',
      cutOffDate: '10/06/25',
    },
    {
      id: 'Analytics07102025.193545',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 10,00',
      status: 'Expired value date',
      cutOffDate: '10/07/25',
    },
  ],
  release: [
    {
      id: 'Analytics01102025.194659',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 1,12',
      status: 'Expired value date',
      cutOffDate: '10/01/25',
    },
    {
      id: 'Analytics01102025.193752',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 1,12',
      status: 'Expired value date',
      cutOffDate: '10/01/25',
    },
    {
      id: 'CSWIREAPI',
      from: 'From (..8488)',
      type: 'Wire',
      amount: 'USD 1,12',
      status: 'Expired value date',
      cutOffDate: '10/01/25',
    },
    {
      id: 'CSAutoACH Credit4792',
      from: 'From (..8280)',
      type: 'ACH Credit',
      amount: 'USD 20,01',
      status: 'Expired value date',
      cutOffDate: '10/02/25',
    },
    {
      id: 'CSITCAPI',
      from: 'From (..8280)',
      type: 'ACH Credit',
      amount: 'USD 100,01',
      status: 'Expired value date',
      cutOffDate: '10/02/25',
    },
  ],
};

type PaymentItem = (typeof mockPayments)['approve'][number];

type PaymentGroup = {
  date: string;
  payments: PaymentItem[];
};

const Payments: React.FC = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<'approve' | 'release'>('approve');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const currentPayments = activeTab === 'approve' ? mockPayments.approve : mockPayments.release;

  const groupedPayments: PaymentGroup[] = useMemo(() => {
    const groups = currentPayments.reduce<Record<string, PaymentItem[]>>((acc, payment) => {
      if (!acc[payment.cutOffDate]) {
        acc[payment.cutOffDate] = [];
      }
      acc[payment.cutOffDate].push(payment);
      return acc;
    }, {});

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, payments]) => ({ date, payments }));
  }, [currentPayments]);

  const clearSelection = () => {
    setIsSelectMode(false);
    setSelectedItems(new Set());
  };

  const handleSelectToggle = () => {
    if (isSelectMode) {
      clearSelection();
    } else {
      setIsSelectMode(true);
    }
  };

  const handleItemSelect = (paymentId: string) => {
    const next = new Set(selectedItems);
    if (next.has(paymentId)) {
      next.delete(paymentId);
    } else {
      next.add(paymentId);
    }
    setSelectedItems(next);
  };

  const handleActionClick = (actionType: 'approve' | 'release') => {
    const selectedPaymentItems = currentPayments.filter(payment =>
      selectedItems.has(payment.id)
    );

    clearSelection();
    history.push('/approve-release', {
      selectedItems: selectedPaymentItems,
      actionType,
    });
  };

  const tabButtonClasses = (tab: 'approve' | 'release') =>
    `flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold transition ${
      activeTab === tab
        ? 'bg-slate-900 text-white shadow'
        : 'bg-white text-slate-600 border border-slate-200'
    }`;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="px-4 pb-3">
          <div className="flex items-center justify-between gap-3 py-2">
            <button
              type="button"
              onClick={handleSelectToggle}
              className="text-sm font-semibold text-slate-600"
            >
              {isSelectMode ? 'Cancel' : 'Select'}
            </button>
            <IonTitle className="text-base font-semibold text-slate-800">
              Pending payments
            </IonTitle>
            <button type="button" className="text-sm font-semibold text-slate-600">
              History
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-full border border-slate-200 bg-white px-4 py-2">
            <div className="flex flex-1 items-center gap-3">
              <img src="/images/Search.svg" alt="Search" className="h-5 w-5 opacity-70" />
              <input
                type="search"
                placeholder={activeTab === 'approve' ? 'Search approvals' : 'Search releases'}
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <button type="button" className="rounded-full border border-slate-200 p-2">
              <img src="/images/Filter.svg" alt="Filter" className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button type="button" className={tabButtonClasses('approve')} onClick={() => {
              if (activeTab !== 'approve') {
                clearSelection();
                setActiveTab('approve');
              }
            }}>
              Approve
            </button>
            <button type="button" className={tabButtonClasses('release')} onClick={() => {
              if (activeTab !== 'release') {
                clearSelection();
                setActiveTab('release');
              }
            }}>
              Release
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="space-y-6 bg-slate-100 p-4 pb-24">
          {groupedPayments.map(group => (
            <section key={group.date} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Cut-off date {group.date}
                </p>
                {isSelectMode && (
                  <span className="text-xs font-medium text-slate-400">
                    Tap a payment to toggle selection
                  </span>
                )}
              </div>

              {group.payments.map(payment => {
                const isSelected = selectedItems.has(payment.id);
                return (
                  <div
                    key={payment.id}
                    onClick={() => (isSelectMode ? handleItemSelect(payment.id) : undefined)}
                    className={`flex cursor-pointer flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-primary/70 hover:shadow-md ${
                      isSelectMode && isSelected ? 'ring-2 ring-teal-primary' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isSelectMode && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleItemSelect(payment.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-primary focus:ring-teal-primary"
                        />
                      )}
                      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <p className="text-base font-semibold text-slate-900">{payment.id}</p>
                          <p className="text-sm text-slate-500">{payment.from}</p>
                        </div>
                        <div className="flex flex-col items-start gap-2 text-sm text-slate-500 sm:items-end">
                          <div className="flex items-center gap-2">
                            <span>{payment.type}</span>
                            <img src="/images/ArrowForward.svg" alt="Go" className="h-4 w-4" />
                          </div>
                          <p className="text-base font-semibold text-slate-900">{payment.amount}</p>
                          <div className="flex items-center gap-2 text-amber-600">
                            <img src="/images/Warning.svg" alt="Warning" className="h-5 w-5" />
                            <span className="text-sm font-medium">{payment.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </IonContent>

      {selectedItems.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex gap-3 bg-white px-4 pb-6 pt-4 shadow-lg">
          <button
            type="button"
            className="flex-1 rounded-full border border-teal-primary px-4 py-3 text-sm font-semibold text-teal-primary"
            onClick={clearSelection}
          >
            Reject ({selectedItems.size})
          </button>
          <button
            type="button"
            className="flex-1 rounded-full bg-teal-primary px-4 py-3 text-sm font-semibold text-white shadow"
            onClick={() => handleActionClick(activeTab)}
          >
            {activeTab === 'approve' ? 'Approve' : 'Release'} ({selectedItems.size})
          </button>
        </div>
      )}
    </IonPage>
  );
};

export default Payments;
