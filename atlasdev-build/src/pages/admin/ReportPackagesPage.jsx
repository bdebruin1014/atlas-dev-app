import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, BarChart3, Edit, Play, Calendar } from 'lucide-react';

const reportPackages = [
  { id: 1, name: 'Monthly Financial Summary', reports: 4, schedule: 'Monthly (1st)', recipients: 3, lastRun: '2024-11-01' },
  { id: 2, name: 'Weekly Project Status', reports: 2, schedule: 'Weekly (Mon)', recipients: 5, lastRun: '2024-10-28' },
  { id: 3, name: 'Quarterly Investor Report', reports: 6, schedule: 'Quarterly', recipients: 8, lastRun: '2024-10-01' },
  { id: 4, name: 'Construction Progress', reports: 3, schedule: 'Bi-weekly', recipients: 4, lastRun: '2024-10-21' },
  { id: 5, name: 'Cash Flow Analysis', reports: 2, schedule: 'Monthly (15th)', recipients: 2, lastRun: '2024-10-15' },
  { id: 6, name: 'Year-End Tax Package', reports: 8, schedule: 'Annually', recipients: 12, lastRun: '2024-01-15' },
];

const ReportPackagesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Report Packages</h1><p className="text-gray-500">Generate groups of reports on a regular schedule</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Create Package</Button>
    </div>

    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Packages</p><p className="text-2xl font-bold">{reportPackages.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Reports</p><p className="text-2xl font-bold">{reportPackages.reduce((s, p) => s + p.reports, 0)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Recipients</p><p className="text-2xl font-bold">{reportPackages.reduce((s, p) => s + p.recipients, 0)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Scheduled</p><p className="text-2xl font-bold text-emerald-600">{reportPackages.length}</p></CardContent></Card>
    </div>

    <Card>
      <CardContent className="pt-4">
        <Table>
          <TableHeader><TableRow><TableHead>Package Name</TableHead><TableHead className="text-center">Reports</TableHead><TableHead>Schedule</TableHead><TableHead className="text-center">Recipients</TableHead><TableHead>Last Run</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {reportPackages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-gray-400" />{pkg.name}</div></TableCell>
                <TableCell className="text-center">{pkg.reports}</TableCell>
                <TableCell><Badge variant="outline"><Calendar className="w-3 h-3 mr-1" />{pkg.schedule}</Badge></TableCell>
                <TableCell className="text-center">{pkg.recipients}</TableCell>
                <TableCell className="text-gray-500">{pkg.lastRun}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Play className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default ReportPackagesPage;
