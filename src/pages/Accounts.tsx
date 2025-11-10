import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { accountsData } from '../data/accountsData';

const mockAccounts = accountsData;

const Accounts: React.FC = () => {
  const history = useHistory();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts ? JSON.parse(savedAccounts) : mockAccounts;
  });

  const [sortedAccounts, setSortedAccounts] = useState<any[]>([]);

  useEffect(() => {
    const sorted = Object.values(accounts).sort((a: any, b: any) => {
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setSortedAccounts(sorted);
  }, [accounts, sortOrder]);

  const handleAccountClick = (accountId: string) => {
    history.push(`/accounts/account-details/${accountId}`);
  };

  const handleSortClick = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleStarClick = (accountId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedAccounts = {
      ...accounts,
      [accountId]: {
        ...accounts[accountId],
        isStarred: !accounts[accountId].isStarred,
      },
    };
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <div className="flex items-center justify-between">
          <div className="w-1/3"></div>
          <div className="w-1/3 text-center">
            <h1 className="text-xl font-semibold">Accounts</h1>
            <select className="border-none bg-transparent text-blue-600">
              <option>Current day</option>
              <option>Prior day</option>
              <option>Last week</option>
            </select>
          </div>
          <div className="w-1/3 flex justify-end">
            <img
              src={sortOrder === 'asc' ? '/images/SortDown.svg' : '/images/SortUp.svg'}
              alt="Sort"
              className="w-6 h-6 cursor-pointer"
              onClick={handleSortClick}
            />
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Current available</p>
              <h2 className="text-2xl font-bold">1 063 261<span className="text-lg">,52</span></h2>
            </div>
            <select className="border-none bg-transparent text-blue-600">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center py-2">
            <span>Opening balance</span>
            <span className="font-bold">1 063 261,52</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center py-2">
            <span>Current balance</span>
            <span className="font-bold">1 063 261,52</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <img src="/images/PiggyBank.svg" alt="Credits" className="w-5 h-5 mr-2" />
              <span>Credits</span>
            </div>
            <span className="font-bold">0,00</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <img src="/images/VisibilityOn.svg" alt="Debits" className="w-5 h-5 mr-2" />
              <span>Debits</span>
            </div>
            <span className="font-bold">(0,00)</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-blue-700 my-4 px-2">Accounts</h3>
          {sortedAccounts.map((account: any) => (
            <div key={account.id} className="bg-white rounded-lg shadow p-4 mb-2 cursor-pointer" onClick={() => handleAccountClick(account.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={account.isStarred ? '/images/StarFilled.svg' : '/images/StarBlank.svg'}
                    alt="Star"
                    className="w-5 h-5 mr-4 cursor-pointer"
                    onClick={(e) => handleStarClick(account.id, e)}
                  />
                  <div>
                    <h3 className="font-semibold">{account.name}<span className="text-gray-500 font-normal ml-2">{account.number}</span></h3>
                    <p className="text-sm text-gray-600">{account.currency} {account.currentBalance}</p>
                  </div>
                </div>
                <img src="/images/ArrowForward.svg" alt="Details" className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Accounts;