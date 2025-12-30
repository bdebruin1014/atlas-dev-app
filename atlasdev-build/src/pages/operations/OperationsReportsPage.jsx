import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3 } from 'lucide-react';

const reports = [
  { id: 1, name: 'Project Status Summary', type: 'Dashboard', lastRun: '2024-11-01' },
  { id: 2, name: 'Task Completion Report', type: 'Performance', lastRun: '2024-10-28' },
  { id: 3, name: 'Budget vs Actual', type: 'Financial', lastRun: '2024-10-25' },
  { id: 4, name: 'Timeline Analysis', type: 'Schedule', lastRun: '2024-10-20' },
];

const OperationsReportsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Operations Reports</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Create Report</Button>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {reports.map((r) => (
        <Card key={r.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><BarChart3 className="w-5 h-5 text-blue-600" /></div>
                <div><p className="font-medium">{r.name}</p><p className="text-sm text-gray-500">{r.type}</p></div>
              </div>
              <Button variant="outline" size="sm">Run</Button>
            </div>
            <p className="text-xs text-gray-400 mt-3">Last run: {r.lastRun}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default OperationsReportsPage;
