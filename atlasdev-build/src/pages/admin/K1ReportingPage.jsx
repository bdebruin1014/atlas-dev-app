import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileSpreadsheet, Download, Send, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const taxYears = [
  { year: 2024, status: 'in-progress', k1sGenerated: 0, k1sSent: 0, deadline: '2025-03-15' },
  { year: 2023, status: 'completed', k1sGenerated: 8, k1sSent: 8, deadline: '2024-03-15' },
  { year: 2022, status: 'completed', k1sGenerated: 6, k1sSent: 6, deadline: '2023-03-15' },
];

const K1ReportingPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">K-1 Reporting</h1><p className="text-gray-500">Configure K-1 tax reporting for investors</p></div>
      <Button><FileSpreadsheet className="w-4 h-4 mr-2" />Generate 2024 K-1s</Button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-yellow-600" /></div>
            <div><p className="text-sm text-gray-500">2024 Status</p><p className="text-xl font-bold text-yellow-600">In Progress</p></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FileSpreadsheet className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-sm text-gray-500">Investors (2024)</p><p className="text-xl font-bold">4</p></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <div><p className="text-sm text-gray-500">2024 Deadline</p><p className="text-xl font-bold">Mar 15, 2025</p></div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader><CardTitle>Tax Year History</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Tax Year</TableHead><TableHead>Status</TableHead><TableHead className="text-center">K-1s Generated</TableHead><TableHead className="text-center">K-1s Sent</TableHead><TableHead>Deadline</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {taxYears.map((year) => (
              <TableRow key={year.year}>
                <TableCell className="font-medium">{year.year}</TableCell>
                <TableCell>
                  <Badge className={year.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                    {year.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                    {year.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{year.k1sGenerated}</TableCell>
                <TableCell className="text-center">{year.k1sSent}</TableCell>
                <TableCell>{year.deadline}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                    {year.status === 'completed' && <Button variant="ghost" size="sm"><Send className="w-4 h-4" /></Button>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>K-1 Settings</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Tax Preparer</p>
            <p className="text-sm text-gray-500">Not configured</p>
            <Button variant="outline" size="sm" className="mt-2">Configure</Button>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Default Distribution Method</p>
            <p className="text-sm text-gray-500">Email + Portal</p>
            <Button variant="outline" size="sm" className="mt-2">Change</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default K1ReportingPage;
