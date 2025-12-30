import React, { useState } from 'react';
import { 
  Rss, Grid, Table2
} from 'lucide-react';

const SubscribedReportsPage = () => {
  const [activeTab, setActiveTab] = useState('packages');

  const subscribedPackages = [
    { id: 1, name: 'Open Projects - Faith PL', schedule: 'Generated at 9am EDT Weekly on Monday' },
    { id: 2, name: 'Open Projects - Lori PL', schedule: 'Generated at 8am EDT Weekly on Monday' },
  ];

  const individualReports = [
    { id: 1, name: 'Weekly Pipeline Report', schedule: 'Generated at 8am EDT Weekly on Monday' },
    { id: 2, name: 'Monthly Investor Summary', schedule: 'Generated at 9am EDT Monthly on the 1st' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Rss className="w-5 h-5 text-gray-500" />
        <h1 className="text-lg font-semibold text-gray-900">Subscribed Reports</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2 text-xs rounded ${
            activeTab === 'packages'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Report Packages
        </button>
        <button
          onClick={() => setActiveTab('individual')}
          className={`px-4 py-2 text-xs rounded ${
            activeTab === 'individual'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Individual Reports
        </button>
      </div>

      {activeTab === 'packages' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Grid className="w-4 h-4 text-gray-500" />
            <h2 className="text-base font-medium text-gray-900">Report Packages</h2>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Grid className="w-4 h-4" />
            <span>Report Packages</span>
            <span className="text-gray-400">›</span>
            <span>Subscribed Packages</span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {subscribedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300"
              >
                <Table2 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-[#047857] mb-1">{pkg.name}</h3>
                <p className="text-xs text-gray-500">{pkg.schedule}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'individual' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Rss className="w-4 h-4 text-gray-500" />
            <h2 className="text-base font-medium text-gray-900">Individual Reports</h2>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {individualReports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300"
              >
                <Table2 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-[#047857] mb-1">{report.name}</h3>
                <p className="text-xs text-gray-500">{report.schedule}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SubscribedReportsPage;
