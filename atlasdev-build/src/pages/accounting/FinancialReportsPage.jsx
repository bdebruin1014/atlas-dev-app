import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, Download, TrendingUp, DollarSign, PieChart } from 'lucide-react';

const reports = [
  { id: 1, name: 'Income Statement', description: 'Revenue and expenses summary', icon: TrendingUp, lastRun: '2024-10-31' },
  { id: 2, name: 'Balance Sheet', description: 'Assets, liabilities, and equity', icon: DollarSign, lastRun: '2024-10-31' },
  { id: 3, name: 'Cash Flow Statement', description: 'Cash inflows and outflows', icon: BarChart3, lastRun: '2024-10-31' },
  { id: 4, name: 'Profit & Loss by Project', description: 'P&L breakdown by project', icon: PieChart, lastRun: '2024-10-25' },
];

const FinancialReportsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
      <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export All</Button>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {reports.map((r) => {
        const Icon = r.icon;
        return (
          <Card key={r.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center"><Icon className="w-6 h-6 text-emerald-600" /></div>
                  <div><p className="font-medium text-lg">{r.name}</p><p className="text-sm text-gray-500">{r.description}</p></div>
                </div>
                <Button>Run</Button>
              </div>
              <p className="text-xs text-gray-400 mt-4">Last run: {r.lastRun}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

export default FinancialReportsPage;
