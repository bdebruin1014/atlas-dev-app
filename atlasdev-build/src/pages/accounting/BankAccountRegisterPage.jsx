import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Download } from 'lucide-react';

const transactions = [
  { id: 1, date: '2024-11-01', description: 'Wire Transfer - Construction Draw', type: 'debit', amount: 125000, balance: 360000, status: 'cleared' },
  { id: 2, date: '2024-10-28', description: 'Investor Capital Contribution', type: 'credit', amount: 100000, balance: 485000, status: 'cleared' },
  { id: 3, date: '2024-10-25', description: 'Permit Fees - City of Denver', type: 'debit', amount: 8500, balance: 385000, status: 'cleared' },
  { id: 4, date: '2024-10-22', description: 'ABC Lumber - Materials', type: 'debit', amount: 45000, balance: 393500, status: 'cleared' },
  { id: 5, date: '2024-10-20', description: 'Interest Income', type: 'credit', amount: 125, balance: 438500, status: 'cleared' },
];

const BankAccountRegisterPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Bank Register</h1>
      <div className="flex gap-2"><Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button><Button><Plus className="w-4 h-4 mr-2" />Add Transaction</Button></div>
    </div>
    <div className="flex gap-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search transactions..." className="pl-9" /></div></div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead><TableHead className="text-right">Balance</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.date}</TableCell>
              <TableCell className="font-medium">{t.description}</TableCell>
              <TableCell className="text-right text-red-600">{t.type === 'debit' ? `$${t.amount.toLocaleString()}` : ''}</TableCell>
              <TableCell className="text-right text-emerald-600">{t.type === 'credit' ? `$${t.amount.toLocaleString()}` : ''}</TableCell>
              <TableCell className="text-right font-medium">${t.balance.toLocaleString()}</TableCell>
              <TableCell><Badge className="bg-green-500">{t.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default BankAccountRegisterPage;
