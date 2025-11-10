import React from 'react';
import { useHistory } from 'react-router-dom';

const Profile: React.FC = () => {
  const history = useHistory();

  const handleAppExperience = () => {
    history.push('/app-experience');
  };

  const menuItems = [
    { icon: '/images/Settings.svg', label: 'Settings', action: () => console.log('Settings') },
    { icon: '/images/Phone.svg', label: 'Support', action: () => console.log('Support') },
    { icon: '/images/Alert.svg', label: 'Notifications', action: () => console.log('Notifications') },
    { icon: '/images/Apps.svg', label: 'App Experience', action: handleAppExperience },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-semibold text-center">Profile</h1>
      </header>
      <main className="p-4">
        <div className="flex items-center mb-8">
          <img src="/images/Profile.svg" alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
          <h2 className="text-2xl font-semibold">test mobile</h2>
        </div>

        <div className="bg-white rounded-lg shadow">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-between p-4 cursor-pointer ${index < menuItems.length - 1 ? 'border-b' : ''}`}
              onClick={item.action}
            >
              <div className="flex items-center">
                <img src={item.icon} alt={item.label} className="w-6 h-6 mr-4" />
                <span>{item.label}</span>
              </div>
              <img src="/images/ArrowForward.svg" alt=">" className="w-5 h-5" />
            </div>
          ))}
        </div>

        <div className="text-center my-8">
          <p className="text-gray-600">Last login</p>
          <p className="text-sm text-gray-500">24-Oct-25 at 9:41 PM</p>
        </div>

        <div className="space-y-4">
          <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-full">
            Give feedback
          </button>
          <button className="w-full bg-blue-600 text-white py-3 rounded-full">
            Log out
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
