import React from 'react';
import { 
  FolderOpen, Grid, Table2
} from 'lucide-react';

const ReportPackagesPage = () => {
  const packages = [
    { id: 1, name: 'Open Projects - Faith PL', schedule: 'Generated at 9am EDT Weekly on Monday' },
    { id: 2, name: 'Open Projects - Lori PL', schedule: 'Generated at 8am EDT Weekly on Monday' },
    { id: 3, name: 'Significant Audit Findings - DLF Trust Account - 7031', schedule: 'Generated at 8am EDT Weekly on Wednesday' },
    { id: 4, name: 'Monthly VanRock Portfolio Report', schedule: 'Generated at 9am EDT Monthly on the 1st' },
    { id: 5, name: 'Exceptions Report - DLF Trust 7031', schedule: 'Generated at 7pm EDT Daily' },
    { id: 6, name: 'Weekly Investor Update', schedule: 'Generated at 5am EDT Monthly on the 1st' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FolderOpen className="w-5 h-5 text-gray-500" />
        <h1 className="text-lg font-semibold text-gray-900">Report Packages</h1>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Grid className="w-4 h-4" />
        <span>Report Packages</span>
        <span className="text-gray-400">›</span>
        <span>All Packages</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 cursor-pointer transition-all"
          >
            <Table2 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-[#047857] mb-1">{pkg.name}</h3>
            <p className="text-xs text-gray-500">{pkg.schedule}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportPackagesPage;
