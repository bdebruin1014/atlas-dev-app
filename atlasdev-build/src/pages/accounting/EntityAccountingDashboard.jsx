import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt, Users, ArrowRight } from 'lucide-react';

const mockEntity = { name: 'VanRock Holdings LLC', balance: 1250000, income: 450000, expenses: 285000, pendingBills: 45000 };

const EntityAccountingDashboard = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const basePath = `/accounting/entities/${entityId}`;
  
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <h1 className="text-2xl font-bold text-gray-900">Accounting Overview</h1>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Cash Balance</p><p className="text-2xl font-bold">${(mockEntity.balance / 1000).toFixed(0)}K</p></div><DollarSign className="w-8 h-8 text-emerald-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">YTD Income</p><p className="text-2xl font-bold text-emerald-600">${(mockEntity.income / 1000).toFixed(0)}K</p></div><TrendingUp className="w-8 h-8 text-emerald-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">YTD Expenses</p><p className="text-2xl font-bold text-red-600">${(mockEntity.expenses / 1000).toFixed(0)}K</p></div><TrendingDown className="w-8 h-8 text-red-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Pending Bills</p><p className="text-2xl font-bold text-yellow-600">${(mockEntity.pendingBills / 1000).toFixed(0)}K</p></div><Receipt className="w-8 h-8 text-yellow-500" /></div></CardContent></Card>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate(`${basePath}/bank-accounts`)}>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-lg">Banking</CardTitle><ArrowRight className="w-5 h-5 text-gray-400" /></CardHeader>
          <CardContent><p className="text-gray-500">Manage bank accounts, reconciliation, deposits, and wires</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate(`${basePath}/bills`)}>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-lg">Transactions</CardTitle><ArrowRight className="w-5 h-5 text-gray-400" /></CardHeader>
          <CardContent><p className="text-gray-500">Bills, payments, invoices, and journal entries</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate(`${basePath}/capital`)}>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-lg">Capital & Investors</CardTitle><ArrowRight className="w-5 h-5 text-gray-400" /></CardHeader>
          <CardContent><p className="text-gray-500">Capital accounts, distributions, and K-1 documents</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate(`${basePath}/reports`)}>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-lg">Reports</CardTitle><ArrowRight className="w-5 h-5 text-gray-400" /></CardHeader>
          <CardContent><p className="text-gray-500">Financial statements, trial balance, and chart of accounts</p></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EntityAccountingDashboard;
