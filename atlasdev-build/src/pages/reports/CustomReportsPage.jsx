import React, { useState } from 'react';
import { 
  FileText, Search, Plus, MoreVertical, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CustomReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const customReports = [
    { id: 1, name: '2024 Client List', description: 'No description', type: 'Custom report' },
    { id: 2, name: 'Agent Tracking', description: 'No description', type: 'Custom report' },
    { id: 3, name: 'Investor Newsletter Campaign', description: 'No description', type: 'Custom report' },
    { id: 4, name: 'Closing By Zip', description: 'No description', type: 'Custom report' },
    { id: 5, name: 'Closings', description: 'Week of 5/25 - 5/29', type: 'Custom report' },
    { id: 6, name: 'FY2024', description: 'No description', type: 'Custom report' },
    { id: 7, name: 'Lender Report', description: 'No description', type: 'Custom report' },
    { id: 8, name: 'Contractor Report - Active', description: 'List of All Active Contractors', type: 'Custom report' },
    { id: 9, name: 'Active Projects', description: 'No description', type: 'Custom report' },
    { id: 10, name: 'Project Tasks', description: 'Upcoming and Overdue Tasks', type: 'Custom report' },
    { id: 11, name: 'Investor Summary', description: 'No description', type: 'Custom report' },
    { id: 12, name: 'Pipeline Report', description: 'No description', type: 'Custom report' },
  ];

  const filteredReports = customReports.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <h1 className="text-lg font-semibold text-gray-900">Custom Reports</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64 h-9 text-sm"
            />
          </div>
          <Button variant="outline" className="h-9">
            <Download className="w-4 h-4" />
          </Button>
          <Button className="bg-[#047857] hover:bg-[#065f46] text-white text-xs h-9">
            <Plus className="w-4 h-4 mr-1" />
            Add Custom Report
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Reports</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{report.name}</h3>
                <p className="text-xs text-gray-500">{report.description}</p>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#047857]">
              <FileText className="w-3.5 h-3.5" />
              {report.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomReportsPage;
