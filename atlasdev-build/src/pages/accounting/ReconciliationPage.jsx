import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, CheckCircle, Clock } from 'lucide-react';

const reconciliations = [
  { id: 1, account: 'Operating Account', period: 'October 2024', statementBalance: 485000, bookBalance: 485000, difference: 0, status: 'completed' },
  { id: 2, account: 'Reserves Account', period: 'October 2024', statementBalance: 250000, bookBalance: 250000, difference: 0, status: 'completed' },
  { id: 3, account: 'Operating Account', period: 'November 2024', statementBalance: 360000, bookBalance: 362500, difference: 2500, status: 'in_progress' },
];

const ReconciliationPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Bank Reconciliation</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Start Reconciliation</Button>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Account</TableHead><TableHead>Period</TableHead><TableHead className="text-right">Statement</TableHead><TableHead className="text-right">Book</TableHead><TableHead className="text-right">Difference</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {reconciliations.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.account}</TableCell>
              <TableCell>{r.period}</TableCell>
              <TableCell className="text-right">${r.statementBalance.toLocaleString()}</TableCell>
              <TableCell className="text-right">${r.bookBalance.toLocaleString()}</TableCell>
              <TableCell className={`text-right ${r.difference !== 0 ? 'text-red-600' : 'text-emerald-600'}`}>${r.difference.toLocaleString()}</TableCell>
              <TableCell><Badge className={r.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>{r.status.replace('_', ' ')}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default ReconciliationPage;
