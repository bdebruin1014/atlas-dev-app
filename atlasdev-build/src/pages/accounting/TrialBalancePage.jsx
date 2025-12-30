import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Calendar } from 'lucide-react';

const trialBalance = [
  { account: '1000 - Cash', debit: 1250000, credit: 0 },
  { account: '1100 - Accounts Receivable', debit: 45000, credit: 0 },
  { account: '1500 - Construction in Progress', debit: 1850000, credit: 0 },
  { account: '2000 - Accounts Payable', debit: 0, credit: 85000 },
  { account: '2100 - Accrued Expenses', debit: 0, credit: 25000 },
  { account: '2500 - Notes Payable', debit: 0, credit: 1500000 },
  { account: '3000 - Members Equity', debit: 0, credit: 1200000 },
  { account: '3100 - Retained Earnings', debit: 0, credit: 335000 },
];

const TrialBalancePage = () => {
  const totalDebit = trialBalance.reduce((s, t) => s + t.debit, 0);
  const totalCredit = trialBalance.reduce((s, t) => s + t.credit, 0);
  
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Trial Balance</h1>
        <div className="flex gap-2">
          <Button variant="outline"><Calendar className="w-4 h-4 mr-2" />As of: Oct 31, 2024</Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trialBalance.map((t, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{t.account}</TableCell>
                <TableCell className="text-right">{t.debit > 0 ? `$${t.debit.toLocaleString()}` : ''}</TableCell>
                <TableCell className="text-right">{t.credit > 0 ? `$${t.credit.toLocaleString()}` : ''}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-gray-100 font-bold">
              <TableCell>TOTAL</TableCell>
              <TableCell className="text-right">${totalDebit.toLocaleString()}</TableCell>
              <TableCell className="text-right">${totalCredit.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      <Card><CardContent className="pt-4"><p className={`text-center font-medium ${totalDebit === totalCredit ? 'text-emerald-600' : 'text-red-600'}`}>{totalDebit === totalCredit ? '✓ Trial Balance is in balance' : '✗ Trial Balance is out of balance'}</p></CardContent></Card>
    </div>
  );
};

export default TrialBalancePage;
